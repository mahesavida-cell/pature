'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Inisialisasi Firebase yang kuat untuk lingkungan Client dan SSR/Build.
 */
export function initializeFirebase() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
  };

  let app: FirebaseApp;
  
  // Pastikan inisialisasi aman di server side
  if (typeof window === 'undefined') {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
  } else {
    // Client side
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
  }

  const auth = getAuth(app);
  const firestore = getFirestore(app);

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
