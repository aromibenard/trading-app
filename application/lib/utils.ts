import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundToDp(number: number, dp: number ) {
  return Math.round(number * Math.pow(10, dp)) / Math.pow(10, dp)
}

export type CurrencyPair = 'EUR/USD' | 'GBP/USD' | 'USD/CHF' | 'AUD/CAD'

export const colorMapping : Record<CurrencyPair, string> = {
  'EUR/USD': '#FF5733', // Red
  'GBP/USD': '#33FF57', // Green
  'USD/CHF': '#3357FF', // Blue
  'AUD/CAD': '#FFFF33', // Yellow
}