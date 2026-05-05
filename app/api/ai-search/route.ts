import { NextResponse } from 'next/server'

// Simple AI search parser that extracts filters from natural language
function parseAIQuery(query: string) {
  const lowerQuery = query.toLowerCase()
  const filters: {
    brand?: string
    priceMax?: number
    priceMin?: number
    yearFrom?: number
    fuelType?: string
    keywords: string[]
  } = { keywords: [] }

  // Extract brand names
  const brands = ['toyota', 'bmw', 'mercedes', 'honda', 'hyundai', 'kia', 'nissan', 'ford', 'lexus', 'porsche', 'tesla', 'audi', 'volkswagen']
  for (const brand of brands) {
    if (lowerQuery.includes(brand)) {
      filters.brand = brand.charAt(0).toUpperCase() + brand.slice(1)
      if (brand === 'mercedes') filters.brand = 'Mercedes-Benz'
      break
    }
  }

  // Extract price
  const priceMatch = lowerQuery.match(/(\d+)\s*₾|(\d+)\s*ლარ|(\d+)\s*\$/)
  if (priceMatch) {
    const price = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3])
    if (lowerQuery.includes('მდე') || lowerQuery.includes('ქვემოთ') || lowerQuery.includes('იაფი')) {
      filters.priceMax = price
    } else if (lowerQuery.includes('დან') || lowerQuery.includes('ზემოთ')) {
      filters.priceMin = price
    } else {
      filters.priceMax = price
    }
  }

  // Extract year
  const yearMatch = lowerQuery.match(/(20\d{2}|19\d{2})/)
  if (yearMatch) {
    filters.yearFrom = parseInt(yearMatch[1])
  }

  // Extract fuel type
  if (lowerQuery.includes('ჰიბრიდ')) {
    filters.fuelType = 'Hybrid'
  } else if (lowerQuery.includes('ელექტრო') || lowerQuery.includes('electric')) {
    filters.fuelType = 'Electric'
  } else if (lowerQuery.includes('დიზელ')) {
    filters.fuelType = 'Diesel'
  } else if (lowerQuery.includes('ბენზინ')) {
    filters.fuelType = 'Gasoline'
  }

  // Extract keywords
  const keywords = ['იაფი', 'ძვირი', 'ეკონომიური', 'სპორტული', 'ოჯახური', 'კომფორტული']
  for (const keyword of keywords) {
    if (lowerQuery.includes(keyword)) {
      filters.keywords.push(keyword)
    }
  }

  return filters
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json({ filters: {} })
    }

    const parsedFilters = parseAIQuery(query)
    
    return NextResponse.json({ 
      filters: parsedFilters,
      message: 'ფილტრები წარმატებით გაანალიზდა'
    })
  } catch (error) {
    console.error('Error parsing AI query:', error)
    return NextResponse.json({ filters: {}, error: 'შეცდომა' }, { status: 500 })
  }
}
