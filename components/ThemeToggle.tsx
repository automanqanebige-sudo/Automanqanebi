'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const savedTheme = window.localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark

    root.classList.toggle('dark', shouldUseDark)
    setIsDark(shouldUseDark)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const nextIsDark = !isDark

    root.classList.toggle('dark', nextIsDark)
    window.localStorage.setItem('theme', nextIsDark ? 'dark' : 'light')
    setIsDark(nextIsDark)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary"
      aria-label={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mounted && isDark ? 'Light mode' : 'Dark mode'}
    >
      {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
