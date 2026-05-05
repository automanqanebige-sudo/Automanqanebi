'use client'

type Car = {
  id?: string
  name?: string
  price?: number
  image?: string
}

export default function CarCard({
  car,
  currency = 'USD',
  rate = 1
}: {
  car?: Car
  currency?: string
  rate?: number
}) {

  // თუ car საერთოდ არ არის
  if (!car) {
    return <div>Loading...</div>
  }

  const safePrice = car?.price || 0

  const displayPrice =
    currency === 'GEL'
      ? Math.round(safePrice * rate).toLocaleString()
      : safePrice.toLocaleString()

  return (
    <div style={{ border: '1px solid #ccc', padding: 12 }}>
      <h2>{car?.name || "უცნობი მანქანა"}</h2>

      <p>
        ფასი: {displayPrice} {currency}
      </p>

      {car?.image && (
        <img src={car.image} alt="car" width={200} />
      )}
    </div>
  )
}