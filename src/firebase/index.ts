'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Inisialisasi Firebase yang robust untuk lingkungan Client dan Server (SSR/Build).
 * Memastikan tidak ada error 'app/no-options' saat proses prerendering.
 */
export function initializeFirebase() {
  const isClient = typeof window !== 'undefined';
  
  // Gunakan variabel lingkungan jika tersedia, atau fallback ke config hardcoded
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
  };

  let app: FirebaseApp;
  
  if (!getApps().length) {
    app = initializeApp(config as any);
  } else {
    app = getApp();
  }

  return {
    firebaseApp: app,
    auth: isClient ? getAuth(app) : (null as unknown as Auth),
    firestore: isClient ? getFirestore(app) : (null as unknown as Firestore)
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
