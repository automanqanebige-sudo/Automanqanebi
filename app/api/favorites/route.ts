import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'

// GET - fetch favorites for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json([])
    }

    const favoritesRef = collection(db, 'favorites')
    const q = query(favoritesRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    const favorites = []
    for (const favoriteDoc of snapshot.docs) {
      const favoriteData = favoriteDoc.data()
      // Get the car details
      const carRef = doc(db, 'cars', favoriteData.carId)
      const carDoc = await getDoc(carRef)
      if (carDoc.exists()) {
        favorites.push({
          id: carDoc.id,
          ...carDoc.data()
        })
      }
    }

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - add a favorite
export async function POST(request: Request) {
  try {
    const { userId, carId } = await request.json()

    if (!userId || !carId) {
      return NextResponse.json({ error: 'Missing userId or carId' }, { status: 400 })
    }

    // Check if already favorited
    const favoritesRef = collection(db, 'favorites')
    const q = query(favoritesRef, where('userId', '==', userId), where('carId', '==', carId))
    const existing = await getDocs(q)

    if (!existing.empty) {
      return NextResponse.json({ message: 'Already favorited' })
    }

    await addDoc(favoritesRef, {
      userId,
      carId,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Added to favorites' })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
}

// DELETE - remove a favorite
export async function DELETE(request: Request) {
  try {
    const { userId, carId } = await request.json()

    if (!userId || !carId) {
      return NextResponse.json({ error: 'Missing userId or carId' }, { status: 400 })
    }

    const favoritesRef = collection(db, 'favorites')
    const q = query(favoritesRef, where('userId', '==', userId), where('carId', '==', carId))
    const snapshot = await getDocs(q)

    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, 'favorites', docSnap.id))
    }

    return NextResponse.json({ message: 'Removed from favorites' })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
