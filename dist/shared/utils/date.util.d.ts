export declare function formatDateVN(date: Date): string;
export declare function formatDateTimeVN(date: Date): string;
export declare function startOfDay(date: Date): Date;
export declare function endOfDay(date: Date): Date;
export declare function startOfMonth(date: Date): Date;
export declare function endOfMonth(date: Date): Date;
export declare function isPast(date: Date): boolean;
export declare function isFuture(date: Date): boolean;
export declare function isSameDay(date1: Date, date2: Date): boolean;
export declare function addDays(date: Date, days: number): Date;
export declare function addHours(date: Date, hours: number): Date;
export declare function diffInDays(date1: Date, date2: Date): number;
export declare function getMonthYearString(month: number, year: number): string;
export declare function parseMonthYearString(monthYear: string): {
    month: number;
    year: number;
} | null;
