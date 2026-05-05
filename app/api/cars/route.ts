import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const carsRef = collection(db, 'cars')
    const q = query(carsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
    }))
    
    return NextResponse.json(cars)
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json([])
  }
}
