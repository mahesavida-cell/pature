'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Inisialisasi Firebase yang tangguh untuk lingkungan Klien, SSR, dan Build.
 */
export function initializeFirebase() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
  };

  // Cek apakah konfigurasi minimal tersedia
  const isConfigValid = config.apiKey && config.projectId && config.apiKey !== 'dummy-key';

  let app: FirebaseApp;
  
  try {
    if (!getApps().length) {
      // Jika konfigurasi tidak valid saat build, gunakan dummy agar tidak crash
      app = initializeApp(isConfigValid ? config : firebaseConfig);
    } else {
      app = getApp();
    }
  } catch (e) {
    // Fallback terakhir untuk mencegah build failure
    app = initializeApp(firebaseConfig);
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
