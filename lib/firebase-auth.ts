"use client";

import { type Auth, getAuth } from "firebase/auth";
import { getFirebaseApp } from "./firebase-app";

let authInstance: Auth | undefined;

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}
