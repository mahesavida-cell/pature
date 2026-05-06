'use client';

/**
 * @deprecated This file is a legacy configuration. 
 * Please import Firebase hooks and instances from '@/firebase' instead.
 * This proxy ensures that any existing references use the singleton initialized 
 * in the main Firebase module to avoid "already initialized" errors.
 */

import { initializeFirebase } from '@/firebase';

const getSafeServices = () => {
  if (typeof window === 'undefined') return { firestore: null, auth: null };
  const services = initializeFirebase();
  return services;
};

const services = getSafeServices();

export const db = services.firestore;
export const auth = services.auth;
