'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Robust Firebase initialization for Client and Server (SSR/Build) environments.
 * Prevents 'app/no-options' errors during prerendering.
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
    // Only attempt to initialize if we have a config, or if we're on the client
    if (config.apiKey || isClient) {
      app = initializeApp(config as any);
    } else {
      // Fallback for build time if envs are missing
      app = null as unknown as FirebaseApp;
    }
  } else {
    app = getApp();
  }

  // Return initialized services or safely typed nulls for SSR
  return {
    firebaseApp: app,
    auth: (isClient && app) ? getAuth(app) : (null as unknown as Auth),
    firestore: (isClient && app) ? getFirestore(app) : (null as unknown as Firestore)
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
