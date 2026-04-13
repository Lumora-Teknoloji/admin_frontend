import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parsePercentage(val: string | number | undefined | null): number {
    if (!val) return 0;
    if (typeof val === 'number') return Math.max(0, Math.min(100, val));
    const parsed = parseFloat(val.replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
}
