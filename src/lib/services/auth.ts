import { EventEmitter } from 'events';

interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  emailVerified: boolean;
}

interface AuthSession {
  token: string;
  expiresAt: number;
  user: User;
}

interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export class AuthService {
  private session: AuthSession | null = null;
  private eventEmitter: EventEmitter;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(private readonly config: GoogleAuthConfig) {
    this.eventEmitter = new EventEmitter();
    // Set high water mark for auth events
    this.eventEmitter.setMaxListeners(50);
  }

  /**
   * Initialize Google OAuth client and attempt to restore session
   */
  async initialize(): Promise<void> {
    try {
      // Attempt to restore session from storage
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession) {
        const session = JSON.parse(storedSession) as AuthSession;
        if (this.isSessionValid(session)) {
          this.setSession(session);
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      this.clearSession();
    }
  }

  /**
   * Start Google OAuth flow
   */
  async signInWithGoogle(): Promise<void> {
    const { clientId, redirectUri, scopes } = this.config;
    const state = this.generateState();
    
    // Store state for verification
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      state,
      access_type: 'offline',
      prompt: 'consent'
    });

    // Redirect to Google OAuth
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleCallback(code: string, state: string): Promise<void> {
    // Verify state to prevent CSRF
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid OAuth state');
    }

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const session = await response.json() as AuthSession;
      this.setSession(session);
    } finally {
      sessionStorage.removeItem('oauth_state');
    }
  }

  /**
   * Sign out user and clear session
   */
  async signOut(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearSession();
    }
  }

  /**
   * Get current user if authenticated
   */
  getCurrentUser(): User | null {
    return this.session?.user ?? null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.session && this.isSessionValid(this.session);
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.eventEmitter.on('authStateChanged', callback);
    return () => this.eventEmitter.off('authStateChanged', callback);
  }

  private setSession(session: AuthSession): void {
    this.session = session;
    localStorage.setItem('auth_session', JSON.stringify(session));
    this.setupRefreshTimer();
    this.eventEmitter.emit('authStateChanged', session.user);
  }

  private clearSession(): void {
    this.session = null;
    localStorage.removeItem('auth_session');
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.eventEmitter.emit('authStateChanged', null);
  }

  private isSessionValid(session: AuthSession): boolean {
    return session.expiresAt > Date.now();
  }

  private setupRefreshTimer(): void {
    if (!this.session) return;

    const timeToExpiry = this.session.expiresAt - Date.now();
    const refreshTime = Math.max(timeToExpiry - 5 * 60 * 1000, 0); // Refresh 5 min before expiry

    this.refreshTimer = setTimeout(async () => {
      try {
        const response = await fetch('/api/auth/refresh', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to refresh token');

        const newSession = await response.json() as AuthSession;
        this.setSession(newSession);
      } catch (error) {
        console.error('Failed to refresh session:', error);
        this.clearSession();
      }
    }, refreshTime);
  }

  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
