'use client'

import SearchInputWithSuggestions from '@/components/SearchInputWithSuggestions'
import { useLanguage } from '@/context/LanguageContext'

type ServicesTopSearchProps = {
  value: string
  onChange: (value: string) => void
  suggestions?: string[]
}

export default function ServicesTopSearch({
  value,
  onChange,
  suggestions = [],
}: ServicesTopSearchProps) {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
      <SearchInputWithSuggestions
        id="services-search"
        label={t('services.searchAiLabel')}
        value={value}
        onChange={onChange}
        placeholder={t('services.searchAiPlaceholder')}
        suggestions={suggestions}
      />
    </div>
  )
}
