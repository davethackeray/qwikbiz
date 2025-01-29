import { authMonitor } from './monitoring';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  user: User;
  token: string;
}

class AuthService {
  private static storageKey = 'qwikbiz_auth';

  static getSession(): Promise<Session | null> {
    return new Promise((resolve) => {
      // Delay accessing window/localStorage to avoid hydration issues
      if (typeof window === 'undefined') {
        resolve(null);
        return;
      }

      // Wait for next tick to ensure hydration is complete
      setTimeout(() => {
        try {
          const storedData = window.localStorage.getItem(this.storageKey);
          if (!storedData) {
            resolve(null);
            return;
          }

          const session = JSON.parse(storedData) as Session;
          if (!session.token) {
            resolve(null);
            return;
          }

          // Verify token is still valid
          fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${session.token}`,
              'Content-Type': 'application/json'
            }
          }).then(response => {
            if (!response.ok) {
              this.clearSession();
              resolve(null);
              return;
            }
            resolve(session);
          }).catch(() => {
            this.clearSession();
            resolve(null);
          });
        } catch (err) {
          this.clearSession();
          resolve(null);
        }
      }, 0);
    });
  }

  static async login(email: string, password: string): Promise<Session> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    const session = await response.json();
    
    // Track successful login
    authMonitor.trackEvent({
      type: 'login',
      timestamp: Date.now(),
      userId: session.user.id,
      metadata: {
        email: session.user.email
      }
    });
    
    // Delay localStorage access to avoid hydration issues
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.storageKey, JSON.stringify(session));
      }
    }, 0);

    return session;
  }

  static async logout(): Promise<void> {
    const session = await this.getSession();
    if (session?.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Track successful logout
        authMonitor.trackEvent({
          type: 'logout',
          timestamp: Date.now(),
          userId: session.user.id,
          sessionId: session.token
        });
      } catch (err) {
        // Track logout error but continue with logout
        authMonitor.handleError({
          code: 'LOGOUT_ERROR',
          message: err instanceof Error ? err.message : 'Failed to logout',
          timestamp: Date.now(),
          userId: session.user.id,
          sessionId: session.token
        });
        console.error('Logout API error:', err);
      }
    }
    this.clearSession();
  }

  static async signup(email: string, password: string, name: string): Promise<Session> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to signup');
    }

    const session = await response.json();
    
    // Delay localStorage access to avoid hydration issues
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.storageKey, JSON.stringify(session));
      }
    }, 0);

    return session;
  }

  private static clearSession(): void {
    try {
      const storedData = typeof window !== 'undefined' ? 
        window.localStorage.getItem(this.storageKey) : null;
      
      if (storedData) {
        const session = JSON.parse(storedData) as Session;
        // Track session cleared
        authMonitor.trackEvent({
          type: 'token_revoked',
          timestamp: Date.now(),
          userId: session.user.id,
          sessionId: session.token
        });
      }

      // Delay localStorage access to avoid hydration issues
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(this.storageKey);
        }
      }, 0);
    } catch (err) {
      // Ignore parsing errors during cleanup
      console.error('Session cleanup error:', err);
    }
  }
}

export default AuthService;
