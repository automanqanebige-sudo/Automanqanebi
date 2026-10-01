'use client'

import VehicleToolsCalculators from './VehicleToolsCalculators'

export default function LoanCalculator(props: { defaultPrice?: number }) {
  return <VehicleToolsCalculators defaultPrice={props.defaultPrice} />
}
