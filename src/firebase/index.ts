
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Inisialisasi Firebase yang robust untuk lingkungan Client dan SSR/Build.
 * Memastikan tidak ada crash saat dijalankan di sisi server selama proses build.
 */
export function initializeFirebase() {
  const isClient = typeof window !== 'undefined';
  
  // Gunakan config dari env jika tersedia, jika tidak gunakan dari config.ts
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

  // Firestore dan Auth hanya benar-benar berfungsi di sisi Klien (Browser)
  // Namun, kita kembalikan instance-nya jika app sudah diinisialisasi
  const firestore = getFirestore(app);
  const auth = getAuth(app);

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
