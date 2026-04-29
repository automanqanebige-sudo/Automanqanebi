"use client";
import { useCurrency } from '../context/CurrencyContext';

export default function CarCard({ car }: { car: any }) {
  const { currency, rate } = useCurrency();

  // თუ დეფოლტად ფასი დოლარში გაქვს ბაზაში:
  const displayPrice = currency === 'GEL' 
    ? Math.round(car.price * rate).toLocaleString() 
    : car.price.toLocaleString();

  return (
    <div>
      {/* ... სხვა კოდი ... */}
      <p className="text-xl font-bold text-green-600">
        {currency === 'USD' ? '$' : ''} {displayPrice} {currency === 'GEL' ? '₾' : ''}
      </p>
    </div>
  );
}
