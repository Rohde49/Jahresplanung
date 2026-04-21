import { WEEKDAY_NAMES, type CalendarMonth } from "../models/calendar";
import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";

interface RenderMonthCardOptions {
    month: CalendarMonth;
    selectedDateIso: string | null;
    planningEntries: PlanningEntry[];
    persons: Person[];
}

function getEntriesForDate(entries: PlanningEntry[], dateIso: string): PlanningEntry[] {
    return entries.filter((entry) => entry.dateIso === dateIso);
}

function getPersonById(persons: Person[], personId: string): Person | undefined {
    return persons.find((person) => person.id === personId);
}

export function renderMonthCard({
                                    month,
                                    selectedDateIso,
                                    planningEntries,
                                    persons,
                                }: RenderMonthCardOptions): string {
    const weekdayHeaderHtml = `
    <div class="calendar-week-number-header">KW</div>
    ${WEEKDAY_NAMES.map((weekday) => `<div class="calendar-weekday">${weekday}</div>`).join("")}
  `;

    const weekRowsHtml = month.weeks
        .map((week) => {
            const weekNumberHtml = `<div class="calendar-week-number">${week.weekNumber}</div>`;

            const dayCellsHtml = week.days
                .map((day) => {
                    if (!day) {
                        return `<div class="calendar-day calendar-day--empty"></div>`;
                    }

                    const weekendClass = day.isWeekend ? " calendar-day--weekend" : "";
                    const holidayClass = day.holidayName ? " calendar-day--holiday" : "";
                    const selectedClass = day.isoDate === selectedDateIso ? " calendar-day--selected" : "";
                    const dayEntries = getEntriesForDate(planningEntries, day.isoDate);
                    const hasEntriesClass = dayEntries.length > 0 ? " calendar-day--has-entries" : "";

                    const entryIndicatorsHtml = dayEntries
                        .slice(0, 3)
                        .map((entry) => {
                            const person = getPersonById(persons, entry.personId);
                            const color = person?.color ?? "#9ca3af";

                            return `<span class="calendar-entry-dot" style="background-color: ${color};"></span>`;
                        })
                        .join("");

                    const holidayLabel = day.holidayName
                        ? `<span class="calendar-day__holiday">${day.holidayName}</span>`
                        : "";

                    return `
            <button
              class="calendar-day${weekendClass}${holidayClass}${selectedClass}${hasEntriesClass}"
              data-date="${day.isoDate}"
              type="button"
            >
              <span class="calendar-day__number">${day.dayOfMonth}</span>
              ${holidayLabel}
              <span class="calendar-entry-dots">${entryIndicatorsHtml}</span>
            </button>
          `;
                })
                .join("");

            return `
        ${weekNumberHtml}
        ${dayCellsHtml}
      `;
        })
        .join("");

    return `
    <article class="month-card">
      <h3>${month.monthName}</h3>

      <div class="calendar-grid calendar-grid--with-weeknumbers">
        ${weekdayHeaderHtml}
        ${weekRowsHtml}
      </div>
    </article>
  `;
}