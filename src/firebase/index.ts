'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore,
  getFirestore
} from 'firebase/firestore';

/**
 * Global cache to store initialized Firebase services.
 * Mencegah re-inisialisasi ganda yang sering menyebabkan crash pada Next.js HMR.
 */
let cachedSdks: { firebaseApp: FirebaseApp | null; auth: Auth | null; firestore: Firestore | null } = {
  firebaseApp: null,
  auth: null,
  firestore: null
};

/**
 * Initializes or retrieves existing Firebase services in a safe, singleton manner.
 * Didesain khusus untuk Spark Plan: Fokus pada eksekusi Client-Side.
 */
export function initializeFirebase() {
  // SSR Guard: Jangan pernah menjalankan inisialisasi di server
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  // Kembalikan cache jika sudah pernah diinisialisasi dalam sesi ini
  if (cachedSdks.firebaseApp) return cachedSdks;

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let firestore: Firestore;
    try {
      // Inisialisasi dengan Persistence untuk akses offline (Zero-Collusion)
      firestore = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch (e: any) {
      // Fallback jika instansi sudah ada
      firestore = getFirestore(app);
    }

    cachedSdks = {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: firestore
    };
    
    return cachedSdks;
  } catch (err) {
    // Silent fail untuk menjaga stabilitas rendering utama
    return { firebaseApp: null, auth: null, firestore: null };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
