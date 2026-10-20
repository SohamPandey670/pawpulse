import { createContext, useContext, useState, useCallback } from 'react';
import { demoUsers } from '../data/syntheticData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pawpulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('pawpulse_user');
      return null;
    }
  });

  const login = useCallback((email, password) => {
    // In demo mode, match against synthetic demo users
    const match = Object.values(demoUsers).find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (match) {
      const userData = {
        name: match.name,
        email: match.email,
        role: match.role,
        token: `demo-jwt-token-${match.role.toLowerCase()}-${Date.now()}`,
      };
      setUser(userData);
      try {
        localStorage.setItem('pawpulse_user', JSON.stringify(userData));
      } catch {
        // ignore quota errors
      }
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('pawpulse_user');
    } catch {
      // ignore
    }
  }, []);

  const hasRole = useCallback(
    (...roles) => {
      return user && roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
