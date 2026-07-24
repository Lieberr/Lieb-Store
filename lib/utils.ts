import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular js obj

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Format number with decimal places

export function formatNumberWithDecimal(num: number):string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (!error) {
    return 'An unexpected error occurred';
  }

  if (error.name === 'ZodError') {
    const issues = Array.isArray(error.issues)
      ? error.issues
      : Array.isArray(error.errors)
        ? error.errors
        : [];

    const fieldErrors = issues
      .map((issue: any) => issue?.message || 'Invalid input')
      .filter(Boolean);

    return fieldErrors.length > 0 ? fieldErrors.join('. ') : 'Invalid input';
  }

  if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    const field = error.meta?.target?.[0] ?? 'Field';
    const label = typeof field === 'string' ? field : 'Field';
    return `${label.charAt(0).toUpperCase() + label.slice(1)} already exists`;
  }

  return typeof error.message === 'string' ? error.message : 'An unexpected error occurred';
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if(typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string')
  }
}