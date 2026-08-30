'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

type PageTransitionProps = {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setAnimating(false)
    }, 120)
    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ease-premium ${
        animating ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100 page-enter'
      }`}
    >
      {displayChildren}
    </div>
  )
}
