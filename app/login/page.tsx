"use client";

import { getFirebaseAuth } from "@/lib/firebase-auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(getFirebaseAuth(), provider);
      router.push("/profile");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button type="button" onClick={login} className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary px-5 py-3 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
        Google-ით შესვლა
      </button>
    </div>
  );
}
