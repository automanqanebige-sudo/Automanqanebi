"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const loginWithGoogle = async () => {
    try {
      const provider =
        new GoogleAuthProvider();

      await signInWithPopup(
        auth,
        provider
      );

      alert("წარმატებული შესვლა ❤️");

      router.push("/");
    } catch (error) {
      console.log(error);

      alert("შეცდომა ❌");
    }
  };

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: 30,
          borderRadius: 20,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          🔐 Login
        </h1>

        <button
          onClick={loginWithGoogle}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            background: "#ffffff",
            color: "#111",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          🔥 Google Login
        </button>
      </div>
    </div>
  );
}