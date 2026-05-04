"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, UserRole } from './types';

export type ProfileRole = UserRole;

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: ProfileRole;
  org_id: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  canApprove: boolean;
  isAdmin: boolean;
  isReceiver: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: ProfileRole, orgName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
}

const MOCK_USERS: User[] = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: "u2", name: "Bob Smith", email: "bob@example.com", role: "approver" },
  { id: "u3", name: "Carol Davis", email: "carol@example.com", role: "member" },
  { id: "u4", name: "Dan Wilson", email: "dan@example.com", role: "receiver" },
];

const SESSION_KEY = "reimburse_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(MOCK_USERS[0]);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USERS[0]));
      }
    } else {
      setUser(MOCK_USERS[0]);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USERS[0]));
    }
    setIsLoading(false);
  }, []);

  const canApprove = user?.role === "admin" || user?.role === "approver";
  const isAdmin = user?.role === "admin";
  const isReceiver = user?.role === "receiver";

  const profile: Profile | null = user ? {
    id: user.id,
    email: user.email,
    full_name: user.name,
    role: user.role,
    org_id: "org1",
  } : null;

  const signIn = async (_email: string, _password: string) => {
    setUser(MOCK_USERS[0]);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USERS[0]));
  };

  const signUp = async (
    _email: string,
    _password: string,
    fullName: string,
    role: ProfileRole,
    _orgName: string
  ) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name: fullName,
      email: _email,
      role,
    };
    setUser(newUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const signInWithMagicLink = async (_email: string) => {
    setUser(MOCK_USERS[0]);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USERS[0]));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        canApprove,
        isAdmin,
        isReceiver,
        signIn,
        signUp,
        signOut,
        signInWithMagicLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
