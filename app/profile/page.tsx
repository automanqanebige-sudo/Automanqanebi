"use client";

import { auth } from "../../lib/firebase"; // შეცვლილი იმპორტი
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="p-10 text-center">
      {user && (
        <>
          <img src={user.photoURL} className="w-20 h-20 rounded-full mx-auto" />
          <h1 className="mt-4 text-xl font-bold">{user.displayName}</h1>
          <button onClick={() => auth.signOut()} className="mt-4 text-red-500 underline">გასვლა</button>
        </>
      )}
    </div>
  );
}
