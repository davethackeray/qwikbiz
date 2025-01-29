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
      } catch (err) {
        // Continue with logout even if API call fails
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
    // Delay localStorage access to avoid hydration issues
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(this.storageKey);
      }
    }, 0);
  }
}

export default AuthService;
