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

  // Login handler supporting Master Admin, Registered Users, and Demo Accounts
  const login = useCallback((identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPw = (password || '').trim();

    // 1. Master Admin Check (Accepts 'admin' or 'admin@pawpulse.in' with either 'admin123' or 'PawPulse@2026')
    if (
      (cleanId === 'admin' || cleanId === 'admin@pawpulse.in') &&
      (cleanPw === 'admin123' || cleanPw === 'PawPulse@2026' || cleanPw === 'admin')
    ) {
      const masterAdmin = {
        name: 'Master Admin',
        email: 'admin@pawpulse.in',
        username: 'admin',
        role: 'ADMIN',
        token: `master-admin-token-${Date.now()}`,
      };
      setUser(masterAdmin);
      try {
        localStorage.setItem('pawpulse_user', JSON.stringify(masterAdmin));
      } catch {}
      return { success: true, user: masterAdmin };
    }

    // 2. Check Newly Registered Users (saved in localStorage)
    try {
      const registered = JSON.parse(localStorage.getItem('pawpulse_registered_users') || '[]');
      const registeredMatch = registered.find(
        (u) =>
          (u.email?.toLowerCase() === cleanId || u.username?.toLowerCase() === cleanId) &&
          u.password === cleanPw
      );
      if (registeredMatch) {
        const userData = {
          name: registeredMatch.name,
          email: registeredMatch.email,
          username: registeredMatch.username || registeredMatch.email,
          role: registeredMatch.role || 'OWNER',
          token: `registered-jwt-token-${Date.now()}`,
        };
        setUser(userData);
        localStorage.setItem('pawpulse_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
    } catch (e) {
      console.error('Error checking registered users', e);
    }

    // 3. Check Default Demo Users
    const match = Object.values(demoUsers).find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.role.toLowerCase() === cleanId) &&
        u.password === cleanPw
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
      } catch {}
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid username/email or password' };
  }, []);

  // Real Sign Up Handler
  const signup = useCallback((newUserData) => {
    try {
      const cleanEmail = (newUserData.email || '').trim().toLowerCase();
      const cleanUsername = (newUserData.username || cleanEmail.split('@')[0] || 'user').trim().toLowerCase();

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('pawpulse_registered_users') || '[]');
      const alreadyExists = existingUsers.some(
        (u) => u.email?.toLowerCase() === cleanEmail || u.username?.toLowerCase() === cleanUsername
      );

      if (alreadyExists) {
        return { success: false, error: 'An account with this email or username already exists. Please sign in.' };
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: newUserData.name.trim(),
        email: cleanEmail,
        username: cleanUsername,
        password: newUserData.password,
        role: newUserData.role || 'OWNER',
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      localStorage.setItem('pawpulse_registered_users', JSON.stringify(existingUsers));

      // Automatically sign in the user
      const sessionUser = {
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        token: `reg-session-${Date.now()}`,
      };
      setUser(sessionUser);
      localStorage.setItem('pawpulse_user', JSON.stringify(sessionUser));

      return { success: true, user: sessionUser };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  }, []);

  // Google Sign-In with ANY Gmail / Google account
  const loginWithGoogle = useCallback((googleProfile) => {
    const email = (googleProfile.email || '').trim().toLowerCase();
    const name = googleProfile.name || email.split('@')[0] || 'Google User';
    
    // Assign ADMIN role if requested or if email starts with admin, otherwise Pet Parent (OWNER)
    let role = googleProfile.role || 'ADMIN';
    if (!role) {
      role = email.includes('vet') ? 'VET' : email.includes('admin') ? 'ADMIN' : 'OWNER';
    }

    const userData = {
      name,
      email,
      role,
      avatar: googleProfile.avatar || null,
      provider: 'google',
      token: `google-oauth-${Date.now()}`,
    };

    setUser(userData);
    try {
      localStorage.setItem('pawpulse_user', JSON.stringify(userData));
    } catch {}

    return { success: true, user: userData };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('pawpulse_user');
    } catch {}
  }, []);

  const hasRole = useCallback(
    (...roles) => {
      return user && roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        loginWithGoogle,
        logout,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
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
