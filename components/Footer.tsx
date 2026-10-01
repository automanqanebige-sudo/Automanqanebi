'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { SITE_LOGO_MAIN, SITE_LOGO_TLD, SITE_CONTACT_PHONE_TEL } from '@/lib/site'

const footerLinks = {
  marketplace: [
    { href: '/', key: 'nav.home' },
    { href: '/services', key: 'nav.services' },
    { href: '/workshops', key: 'nav.workshops' },
    { href: '/tools', key: 'nav.tools' },
    { href: '/add-car', key: 'footer.addCar' },
    { href: '/favorites', key: 'nav.favorites' },
  ],
  account: [
    { href: '/profile', key: 'nav.profile' },
    { href: '/chat', key: 'footer.messages' },
    { href: '/login', key: 'nav.login' },
  ],
  info: [
    { href: '/about', key: 'footer.about' },
    { href: '/privacy', key: 'footer.privacy' },
    { href: '/terms', key: 'footer.terms' },
    { href: '/cookies', key: 'legal.cookies.title' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  const social = [
    { href: settings.facebookUrl, icon: Facebook, label: 'Facebook' },
    { href: settings.instagramUrl, icon: Instagram, label: 'Instagram' },
    { href: settings.youtubeUrl, icon: Youtube, label: 'YouTube' },
  ].filter((s) => s.href)

  return (
    <footer className="mt-auto border-t border-white/10 bg-[hsl(var(--surface-elevated))] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt={`${SITE_LOGO_MAIN}${SITE_LOGO_TLD}`}
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-contain"
              />
              <span className="text-lg font-bold tracking-tight">
                {SITE_LOGO_MAIN}
                <span className="text-primary">{SITE_LOGO_TLD}</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              {t('footer.description')}
            </p>
            <div className="flex gap-2.5">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-primary hover:text-white hover:shadow-glow"
                  aria-label={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              {t('footer.marketplace')}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href + link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-primary"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              {t('footer.account')}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.href + link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-primary"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2.5 text-sm text-white/65 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary/70" />
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONTACT_PHONE_TEL}`}
                  className="flex items-center gap-2.5 text-sm text-white/65 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                  {settings.contactPhone}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-sm text-white/65">
                  <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                  {t('footer.location')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/45">
            &copy; {currentYear} {`${SITE_LOGO_MAIN}${SITE_LOGO_TLD}`}. {t('footer.allRights')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.info.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm text-white/45 transition-colors hover:text-primary"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
