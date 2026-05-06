'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Inisialisasi context dengan nilai default aman agar SSR tidak pecah
export const FirebaseContext = createContext<FirebaseContextState>({
  areServicesAvailable: false,
  firebaseApp: null,
  firestore: null,
  auth: null,
  user: null,
  isUserLoading: true,
  userError: null,
});

/**
 * FirebaseProvider: Pengelola status layanan tunggal.
 * Menjamin children tetap dirender meskipun Firebase sedang memuat.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userState, setUserState] = useState<{ user: User | null; loading: boolean; error: Error | null }>({
    user: null,
    loading: !!auth,
    error: null,
  });

  useEffect(() => {
    if (!auth) {
      setUserState(prev => ({ ...prev, loading: false }));
      return;
    }

    // Sinkronisasi status autentikasi secara asinkron
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => setUserState({ user, loading: false, error: null }),
      (error) => setUserState({ user: null, loading: false, error })
    );
    
    return () => unsubscribe();
  }, [auth]);

  const contextValue = useMemo(() => ({
    areServicesAvailable: !!(firebaseApp && firestore && auth),
    firebaseApp,
    firestore,
    auth,
    user: userState.user,
    isUserLoading: userState.loading,
    userError: userState.error,
  }), [firebaseApp, firestore, auth, userState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export const useAuth = () => useContext(FirebaseContext).auth;
export const useFirestore = () => useContext(FirebaseContext).firestore;
export const useFirebaseApp = () => useContext(FirebaseContext).firebaseApp;

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  const memoized = useMemo(factory, deps);
  if (typeof memoized === 'object' && memoized !== null) {
    (memoized as any).__memo = true;
  }
  return memoized;
}

export const useUser = () => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};
