import { MONTH_NAMES, WEEKDAY_NAMES, type CalendarMonth } from "../models/calendar";
import type { Category } from "../models/category";
import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";
import { createCalendarYear } from "../utils/date-utils";

interface RenderPrintViewOptions {
    year: number;
    monthIndex: number;
    planningEntries: PlanningEntry[];
    persons: Person[];
    categories: Category[];
}

function getEntriesForDate(entries: PlanningEntry[], dateIso: string): PlanningEntry[] {
    return entries.filter((entry) => entry.dateIso === dateIso);
}

function getPersonById(persons: Person[], personId: string): Person | undefined {
    return persons.find((person) => person.id === personId);
}

function getCategoryById(categories: Category[], categoryId: string): Category | undefined {
    return categories.find((category) => category.id === categoryId);
}

function renderPrintMonth(
    month: CalendarMonth,
    planningEntries: PlanningEntry[],
    persons: Person[],
    categories: Category[],
): string {
    const weekdayHeaderHtml = `
    <div class="print-week-number print-week-number--header">KW</div>
    ${WEEKDAY_NAMES.map((weekday) => `<div class="print-weekday">${weekday}</div>`).join("")}
  `;

    const weekRowsHtml = month.weeks
        .map((week) => {
            const daysHtml = week.days
                .map((day) => {
                    if (!day) {
                        return `<div class="print-day print-day--empty"></div>`;
                    }

                    const entries = getEntriesForDate(planningEntries, day.isoDate);

                    const entryHtml = entries
                        .map((entry) => {
                            const person = getPersonById(persons, entry.personId);
                            const category = getCategoryById(categories, entry.categoryId);

                            return `
                <div class="print-entry">
                  <span class="print-entry__dot" style="background-color: ${person?.color ?? "#9ca3af"};"></span>
                  <span class="print-entry__text">${entry.title}</span>
                  <span class="print-entry__meta">${category?.name ?? "Kategorie"} · ${person?.name ?? "Person"}</span>
                </div>
              `;
                        })
                        .join("");

                    return `
            <div class="print-day ${day.isWeekend ? "print-day--weekend" : ""} ${day.holidayName ? "print-day--holiday" : ""}">
              <div class="print-day__header">
                <span class="print-day__number">${day.dayOfMonth}</span>
                ${day.holidayName ? `<span class="print-day__holiday">${day.holidayName}</span>` : ""}
              </div>
              <div class="print-day__entries">
                ${entryHtml}
              </div>
            </div>
          `;
                })
                .join("");

            return `
        <div class="print-week-number">${week.weekNumber}</div>
        ${daysHtml}
      `;
        })
        .join("");

    return `
    <section class="print-sheet">
      <header class="print-sheet__header">
        <h1>Software-Jahresplanung</h1>
        <div>${month.monthName} ${month.year}</div>
      </header>

      <div class="print-grid">
        ${weekdayHeaderHtml}
        ${weekRowsHtml}
      </div>
    </section>
  `;
}

export function renderPrintView({
                                    year,
                                    monthIndex,
                                    planningEntries,
                                    persons,
                                    categories,
                                }: RenderPrintViewOptions): string {
    const calendarYear = createCalendarYear(year);
    const month = calendarYear.months[monthIndex];

    return `
    <div class="print-view">
      ${renderPrintMonth(month, planningEntries, persons, categories)}
    </div>
  `;
}