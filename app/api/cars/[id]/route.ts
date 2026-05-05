import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const carRef = doc(db, 'cars', params.id)
    const carDoc = await getDoc(carRef)
    
    if (!carDoc.exists()) {
      return NextResponse.json(null, { status: 404 })
    }
    
    const data = carDoc.data()
    return NextResponse.json({
      id: carDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
    })
  } catch (error) {
    console.error('Error fetching car:', error)
    return NextResponse.json(null, { status: 500 })
  }
}
