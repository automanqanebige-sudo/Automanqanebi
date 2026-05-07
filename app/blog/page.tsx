'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Eye, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { sampleBlogPosts, blogCategories } from '@/data/blog'

function formatTimeAgo(date: Date | string, t: (key: string, params?: Record<string, any>) => string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return t('common.today')
  if (diffDays === 1) return t('common.yesterday')
  return t('common.daysAgo', { count: diffDays })
}

export default function BlogPage() {
  const t = useTranslations()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredPosts = selectedCategory === 'all'
    ? sampleBlogPosts
    : sampleBlogPosts.filter(p => p.category === selectedCategory)

  const featuredPost = sampleBlogPosts[0]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.backToHome')}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('blog.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('blog.subtitle')}</p>
        </div>

        {/* Featured post */}
        <Link
          href={`/blog/${featuredPost.id}`}
          className="group mb-10 block overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
              {featuredPost.image && (
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-6 lg:p-8">
              {(() => {
                const cat = blogCategories.find(c => c.value === featuredPost.category)
                return cat ? (
                  <span className={`mb-3 inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                ) : null
              })()}
              <h2 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary lg:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{featuredPost.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {featuredPost.views?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatTimeAgo(featuredPost.createdAt, t)}
                </span>
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {t('blog.readMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-card-foreground hover:bg-secondary'
            }`}
          >
            {t('blog.allArticles')}
          </button>
          {blogCategories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-card-foreground hover:bg-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.slice(1).map((post) => {
            const cat = blogCategories.find(c => c.value === post.category)
            
            return (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  {cat && (
                    <span className={`mb-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${cat.color}`}>
                      {cat.label}
                    </span>
                  )}
                  <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {post.views?.toLocaleString()}
                    </span>
                    <span>{formatTimeAgo(post.createdAt, t)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
            <p className="text-muted-foreground">{t('blog.noPosts')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
