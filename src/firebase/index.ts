
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
  // Jika konfigurasi tidak tersedia (misal di build server), gunakan objek kosong agar tidak crash
  const config = firebaseConfig && firebaseConfig.apiKey ? firebaseConfig : {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  };

  let app: FirebaseApp;
  
  if (!getApps().length) {
    try {
      app = initializeApp(config as any);
    } catch (e) {
      console.warn('Firebase initialization failed, falling back to existing app.');
      app = getApp();
    }
  } else {
    app = getApp();
  }

  // Pada lingkungan server sejati (bukan JSDOM), service mungkin tidak tersedia
  const isClient = typeof window !== 'undefined';

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
