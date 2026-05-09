"use client";

import { auth } from "../../lib/firebase"; // შეცვლილი იმპორტი
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/profile");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={login} className="bg-white border p-3 rounded-lg shadow flex items-center gap-2">
        Google-ით შესვლა
      </button>
    </div>
  );
}
