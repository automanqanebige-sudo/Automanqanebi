'use client'

import VehicleToolsCalculators from './VehicleToolsCalculators'

export default function CustomsCalculator(props: {
  defaultYear?: number
  defaultEngineCc?: number
  fuelType?: string
}) {
  return (
    <VehicleToolsCalculators
      defaultYear={props.defaultYear}
      defaultEngineCc={props.defaultEngineCc}
      fuelType={props.fuelType}
    />
  )
}
