'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Robust Firebase initialization for Client and Server (SSR/Build) environments.
 */
export function initializeFirebase() {
  const isClient = typeof window !== 'undefined';
  
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
  };

  let app: FirebaseApp;
  
  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }

  // Safety: Ensure Firestore and Auth are only called in valid environments
  const firestore = isClient ? getFirestore(app) : (null as unknown as Firestore);
  const auth = isClient ? getAuth(app) : (null as unknown as Auth);

  return {
    firebaseApp: app,
    auth,
    firestore
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
