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
 * This prevents re-initialization errors during HMR or multiple component mounts.
 */
let cachedSdks: { firebaseApp: FirebaseApp | null; auth: Auth | null; firestore: Firestore | null } | null = null;

/**
 * Initializes or retrieves existing Firebase services in a safe, singleton manner.
 * Handles the "initializeFirestore() has already been called" constraint in Next.js.
 */
export function initializeFirebase() {
  // Support for SSR: Return null instances if called on the server
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  // Return cached instances if already initialized in this module execution
  if (cachedSdks && cachedSdks.firebaseApp) return cachedSdks;

  try {
    // Next.js App Router protection: check if an app already exists in the global registry
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let firestore: Firestore;
    try {
      // Attempt to initialize Firestore with persistent offline cache.
      firestore = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch (e: any) {
      // Fallback: get the existing instance if initialization failed (e.g. already initialized)
      firestore = getFirestore(app);
    }

    cachedSdks = {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: firestore
    };
  } catch (err) {
    console.error("Firebase Initialization Error:", err);
    return { firebaseApp: null, auth: null, firestore: null };
  }

  return cachedSdks;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
