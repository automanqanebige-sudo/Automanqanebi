import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const brand = typeof body?.brand === 'string' ? body.brand.trim() : ''
    const model = typeof body?.model === 'string' ? body.model.trim() : ''
    const year =
      body?.year != null && body.year !== '' ? String(body.year).trim() : ''

    if (!brand || !model) {
      return NextResponse.json(
        { error: 'Brand and model are required' },
        { status: 400 }
      )
    }

    const description = `${brand} ${model}${year ? ` (${year})` : ''} — საგამოძახებო კომპლექტაცია; დეტალებისთვის დაგვიკავშირდით.`

    return NextResponse.json({ description })
  } catch (error) {
    console.error('generate-description ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}
