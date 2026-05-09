'use client'

import Link from 'next/link'
import { Car, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { SITE_CONTACT_EMAIL, SITE_LOGO_MAIN, SITE_LOGO_TLD } from '@/lib/site'

const footerLinks = {
  marketplace: [
    { href: '/', key: 'nav.home' },
    { href: '/add-car', key: 'footer.addCar' },
    { href: '/favorites', key: 'nav.favorites' },
  ],
  account: [
    { href: '/profile', key: 'nav.profile' },
    { href: '/chat', key: 'footer.messages' },
    { href: '/login', key: 'nav.login' },
  ],
  info: [
    { href: '#', key: 'footer.about' },
    { href: '#', key: 'footer.privacy' },
    { href: '#', key: 'footer.terms' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                {SITE_LOGO_MAIN}
                <span className="text-primary">{SITE_LOGO_TLD}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">{t('footer.marketplace')}</h3>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href + link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">{t('footer.account')}</h3>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href + link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${SITE_CONTACT_EMAIL}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  {SITE_CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="tel:+995555123456"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  +995 555 123 456
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {t('footer.location')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {`${SITE_LOGO_MAIN}${SITE_LOGO_TLD}`}. {t('footer.allRights')}
          </p>
          <div className="flex gap-6">
            {footerLinks.info.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
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
