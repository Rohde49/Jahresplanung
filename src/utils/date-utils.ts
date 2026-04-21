import {
    type CalendarDay,
    type CalendarMonth,
    type CalendarWeek,
    type CalendarYear,
    type Holiday,
    MONTH_NAMES,
    WEEKDAY_NAMES,
    type WeekdayName,
} from "../models/calendar";

function padNumber(value: number): string {
    return value.toString().padStart(2, "0");
}

function createIsoDate(year: number, monthIndex: number, dayOfMonth: number): string {
    const month = padNumber(monthIndex + 1);
    const day = padNumber(dayOfMonth);

    return `${year}-${month}-${day}`;
}

function getWeekdayName(date: Date): WeekdayName {
    const jsDay = date.getDay();

    const weekdayMap: Record<number, WeekdayName> = {
        0: "So",
        1: "Mo",
        2: "Di",
        3: "Mi",
        4: "Do",
        5: "Fr",
        6: "Sa",
    };

    return weekdayMap[jsDay];
}

function createHolidayIsoDate(year: number, month: number, day: number): string {
    return `${year}-${padNumber(month)}-${padNumber(day)}`;
}

function calculateEasterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
}

function dateToIso(date: Date): string {
    return createIsoDate(date.getFullYear(), date.getMonth(), date.getDate());
}

function getHolidayNameByIsoDate(holidays: Holiday[], isoDate: string): string | null {
    const holiday = holidays.find((entry) => entry.isoDate === isoDate);
    return holiday ? holiday.name : null;
}

function getIsoWeekNumber(date: Date): number {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = utcDate.getUTCDay() || 7;

    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);

    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function createCalendarWeeks(days: CalendarDay[], leadingEmptyDays: number): CalendarWeek[] {
    const weekCells: Array<CalendarDay | null> = [
        ...Array.from({ length: leadingEmptyDays }, () => null),
        ...days,
    ];

    while (weekCells.length % 7 !== 0) {
        weekCells.push(null);
    }

    const weeks: CalendarWeek[] = [];

    for (let index = 0; index < weekCells.length; index += 7) {
        const weekDays = weekCells.slice(index, index + 7);
        const firstRealDay = weekDays.find((day) => day !== null);

        if (!firstRealDay) {
            continue;
        }

        const weekNumber = getIsoWeekNumber(
            new Date(firstRealDay.year, firstRealDay.monthIndex, firstRealDay.dayOfMonth),
        );

        weeks.push({
            weekNumber,
            days: weekDays,
        });
    }

    return weeks;
}

export function getGermanPublicHolidays(year: number): Holiday[] {
    const easterSunday = calculateEasterSunday(year);

    return [
        { name: "Neujahr", isoDate: createHolidayIsoDate(year, 1, 1) },
        { name: "Karfreitag", isoDate: dateToIso(addDays(easterSunday, -2)) },
        { name: "Ostermontag", isoDate: dateToIso(addDays(easterSunday, 1)) },
        { name: "Tag der Arbeit", isoDate: createHolidayIsoDate(year, 5, 1) },
        { name: "Christi Himmelfahrt", isoDate: dateToIso(addDays(easterSunday, 39)) },
        { name: "Pfingstmontag", isoDate: dateToIso(addDays(easterSunday, 50)) },
        { name: "Tag der Deutschen Einheit", isoDate: createHolidayIsoDate(year, 10, 3) },
        { name: "1. Weihnachtstag", isoDate: createHolidayIsoDate(year, 12, 25) },
        { name: "2. Weihnachtstag", isoDate: createHolidayIsoDate(year, 12, 26) },
    ];
}

export function getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
}

export function isWeekend(weekday: WeekdayName): boolean {
    return weekday === "Sa" || weekday === "So";
}

export function getWeekdayIndexFromMonday(weekday: WeekdayName): number {
    return WEEKDAY_NAMES.indexOf(weekday);
}

export function getLeadingEmptyDays(year: number, monthIndex: number): number {
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const firstWeekday = getWeekdayName(firstDayOfMonth);

    return getWeekdayIndexFromMonday(firstWeekday);
}

export function createCalendarDay(
    year: number,
    monthIndex: number,
    dayOfMonth: number,
    holidays: Holiday[],
): CalendarDay {
    const date = new Date(year, monthIndex, dayOfMonth);
    const weekday = getWeekdayName(date);
    const isoDate = createIsoDate(year, monthIndex, dayOfMonth);

    return {
        dayOfMonth,
        monthIndex,
        year,
        isoDate,
        weekday,
        isWeekend: isWeekend(weekday),
        holidayName: getHolidayNameByIsoDate(holidays, isoDate),
    };
}

export function createCalendarMonth(
    year: number,
    monthIndex: number,
    holidays: Holiday[],
): CalendarMonth {
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const days: CalendarDay[] = [];

    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth += 1) {
        days.push(createCalendarDay(year, monthIndex, dayOfMonth, holidays));
    }

    const leadingEmptyDays = getLeadingEmptyDays(year, monthIndex);

    return {
        monthIndex,
        monthName: MONTH_NAMES[monthIndex],
        year,
        days,
        leadingEmptyDays,
        weeks: createCalendarWeeks(days, leadingEmptyDays),
    };
}

export function createCalendarYear(year: number): CalendarYear {
    const months: CalendarMonth[] = [];
    const holidays = getGermanPublicHolidays(year);

    for (let monthIndex = 0; monthIndex < MONTH_NAMES.length; monthIndex += 1) {
        months.push(createCalendarMonth(year, monthIndex, holidays));
    }

    return {
        year,
        months,
    };
}