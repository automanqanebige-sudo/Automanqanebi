'use client'

import VehicleToolsCalculators from './VehicleToolsCalculators'

export default function PawnCalculator(props: { defaultPrice?: number }) {
  return <VehicleToolsCalculators defaultPrice={props.defaultPrice} />
}
