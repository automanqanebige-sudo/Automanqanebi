"use client";

import { auth } from "../../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Car, Chrome } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Car className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              ავტორიზაცია
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              შედით თქვენს ანგარიშში
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <button
              onClick={login}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary"
            >
              <Chrome className="h-5 w-5" />
              Google-ით შესვლა
            </button>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>{"შესვლით თქვენ ეთანხმებით ჩვენს"}</p>
              <div className="mt-1 flex items-center justify-center gap-2">
                <a href="#" className="text-primary hover:underline">პირობებს</a>
                <span>{"და"}</span>
                <a href="#" className="text-primary hover:underline">კონფიდენციალურობას</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
