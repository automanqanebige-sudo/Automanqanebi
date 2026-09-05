/** Approximate Georgian import-customs estimates (GEL). Ballpark for UX — not RS.ge legal advice. */

export type CustomsEstimateInput = {
  year: number
  engineCc: number
  fuelType?: string
  isElectric?: boolean
}

export type CustomsEstimateResult = {
  estimatedGel: number
  breakdown: { label: string; amount: number }[]
  disclaimer: true
}

function ageYears(year: number): number {
  const now = new Date().getFullYear()
  return Math.max(0, now - year)
}

/**
 * Closer to common GE marketplace ballparks:
 * Excise ≈ (engine liters) × age factor × fuel coefficient (GEL).
 * Then + VAT 18% on (excise + approx customs) + fixed service.
 */
export function estimateGeorgianCustoms(input: CustomsEstimateInput): CustomsEstimateResult {
  const age = ageYears(input.year)
  const cc = Math.max(0, input.engineCc || 0)
  const liters = cc / 1000
  const fuel = (input.fuelType || '').toLowerCase()
  const electric = input.isElectric || fuel === 'electric'
  const diesel = fuel === 'diesel'
  const hybrid = fuel === 'hybrid'

  // Age multiplier used in public estimators (younger → lower excise rate / coefficient)
  let ageCoef = 1.5
  if (age <= 1) ageCoef = 0.6
  else if (age <= 3) ageCoef = 0.9
  else if (age <= 5) ageCoef = 1.15
  else if (age <= 7) ageCoef = 1.4
  else if (age <= 10) ageCoef = 1.7
  else if (age <= 14) ageCoef = 2.1
  else ageCoef = 2.6

  let fuelCoef = 1
  if (electric) fuelCoef = 0.15
  else if (hybrid) fuelCoef = 0.75
  else if (diesel) fuelCoef = 1.15

  // base ₾ per liter × liters × age × fuel
  const perLiter = electric ? 400 : 1200
  const excise = Math.round(Math.max(liters, 0.6) * perLiter * ageCoef * fuelCoef)

  const customsDuty = electric ? 0 : Math.round(excise * 0.05)
  const vatBase = excise + customsDuty
  const vatApprox = Math.round(vatBase * 0.18)
  const serviceFee = 120
  const total = excise + customsDuty + vatApprox + serviceFee

  return {
    estimatedGel: total,
    breakdown: [
      { label: 'excise', amount: excise },
      { label: 'customs', amount: customsDuty },
      { label: 'vat', amount: vatApprox },
      { label: 'service', amount: serviceFee },
    ],
    disclaimer: true,
  }
}

export function estimateBankInstallment(params: {
  price: number
  downPaymentPercent: number
  months: number
  annualRatePercent: number
}): { monthly: number; total: number; interest: number } {
  const { price, downPaymentPercent, months, annualRatePercent } = params
  const down = price * (downPaymentPercent / 100)
  const principal = Math.max(0, price - down)
  if (months <= 0) return { monthly: 0, total: down, interest: 0 }
  const r = annualRatePercent / 100 / 12
  let monthly: number
  if (r === 0) monthly = principal / months
  else monthly = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  const totalPay = monthly * months + down
  return {
    monthly: Math.round(monthly),
    total: Math.round(totalPay),
    interest: Math.round(totalPay - price),
  }
}

export function estimatePawnLoan(params: {
  price: number
  appraisalPercent: number
  monthlyRatePercent: number
  months: number
}): { loanAmount: number; monthlyInterest: number; totalRepay: number } {
  const loanAmount = Math.round(params.price * (params.appraisalPercent / 100))
  const monthlyInterest = Math.round(loanAmount * (params.monthlyRatePercent / 100))
  const totalRepay = loanAmount + monthlyInterest * params.months
  return { loanAmount, monthlyInterest, totalRepay }
}
