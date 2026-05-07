"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle, loginWithApple } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    setLoading(true);
    
    try {
      await registerWithEmail(email, password, name);
      router.push("/profile");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError(t('auth.emailInUse'));
      } else if (err.code === "auth/weak-password") {
        setError(t('auth.weakPassword'));
      } else if (err.code === "auth/invalid-email") {
        setError(t('auth.invalidEmail'));
      } else {
        setError(t('auth.registrationFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      router.push("/profile");
    } catch (err) {
      setError(t('auth.googleFailed'));
    }
  };

  const handleAppleLogin = async () => {
    setError("");
    try {
      await loginWithApple();
      router.push("/profile");
    } catch (err) {
      setError(t('auth.appleFailed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="Automanqanebi.ge"
              width={120}
              height={60}
              className="h-16 w-auto"
            />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">{t('auth.createAccount')}</h1>
          <p className="mt-2 text-slate-400">{t('auth.registerSubtitle')}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t('auth.name')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth.namePlaceholder')}
                  required
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 py-3 pl-12 pr-12 text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">{t('auth.passwordMinLength')}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  required
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 py-3 pl-12 pr-4 text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.createAccount')
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-600" />
            <span className="text-sm text-slate-400">{t('auth.orContinueWith')}</span>
            <div className="h-px flex-1 bg-slate-600" />
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-600 bg-slate-700 py-3 font-medium text-white transition-all hover:bg-slate-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('auth.googleRegister')}
            </button>

            <button
              onClick={handleAppleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-600 bg-white py-3 font-medium text-black transition-all hover:bg-slate-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              {t('auth.appleRegister')}
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-400">
            {t('auth.haveAccount')}{" "}
            <Link href="/login" className="font-semibold text-orange-500 hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
