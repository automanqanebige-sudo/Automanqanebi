"use client";

import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebase-app";

/** Client-only — import only from `"use client"` pages/components so Auth is not bundled into Node/API route builds. */
export const auth = getAuth(firebaseApp);
