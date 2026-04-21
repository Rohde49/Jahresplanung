export const MONTH_NAMES = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
] as const;

export const WEEKDAY_NAMES = [
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa",
    "So",
] as const;

export type MonthName = (typeof MONTH_NAMES)[number];
export type WeekdayName = (typeof WEEKDAY_NAMES)[number];

export interface Holiday {
    name: string;
    isoDate: string;
}

export interface CalendarDay {
    dayOfMonth: number;
    monthIndex: number;
    year: number;
    isoDate: string;
    weekday: WeekdayName;
    isWeekend: boolean;
    holidayName: string | null;
}

export interface CalendarWeek {
    weekNumber: number;
    days: Array<CalendarDay | null>;
}

export interface CalendarMonth {
    monthIndex: number;
    monthName: MonthName;
    year: number;
    days: CalendarDay[];
    leadingEmptyDays: number;
    weeks: CalendarWeek[];
}

export interface CalendarYear {
    year: number;
    months: CalendarMonth[];
}