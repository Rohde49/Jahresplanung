import { WEEKDAY_NAMES, type CalendarMonth } from "../models/calendar";
import type { Category } from "../models/category";
import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";

interface RenderMonthCardOptions {
    month: CalendarMonth;
    selectedDateIso: string | null;
    planningEntries: PlanningEntry[];
    persons: Person[];
    categories: Category[];
    isDetailedMonthView: boolean;
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

function renderDetailedEntries(
    dayEntries: PlanningEntry[],
    persons: Person[],
    categories: Category[],
): string {
    if (dayEntries.length === 0) {
        return "";
    }

    const visibleEntries = dayEntries.slice(0, 3);

    const entriesHtml = visibleEntries
        .map((entry) => {
            const person = getPersonById(persons, entry.personId);
            const category = getCategoryById(categories, entry.categoryId);

            const color = person?.color ?? "#9ca3af";
            const categoryName = category?.name ?? "Kategorie";
            const title = entry.title.trim() || categoryName;

            return `
        <div class="calendar-entry-chip" title="${title}">
          <span class="calendar-entry-chip__dot" style="background-color: ${color};"></span>
          <span class="calendar-entry-chip__text">${title}</span>
        </div>
      `;
        })
        .join("");

    const remainingCount = dayEntries.length - visibleEntries.length;
    const moreLabel =
        remainingCount > 0
            ? `<div class="calendar-entry-more">+${remainingCount} weitere</div>`
            : "";

    return `
    <div class="calendar-entry-list">
      ${entriesHtml}
      ${moreLabel}
    </div>
  `;
}

export function renderMonthCard({
                                    month,
                                    selectedDateIso,
                                    planningEntries,
                                    persons,
                                    categories,
                                    isDetailedMonthView,
                                }: RenderMonthCardOptions): string {
    const weekdayHeaderHtml = `
    <div class="calendar-week-number-header">KW</div>
    ${WEEKDAY_NAMES.map((weekday) => `<div class="calendar-weekday">${weekday}</div>`).join("")}
  `;

    const cardClass = isDetailedMonthView ? "month-card month-card--detailed" : "month-card";
    const gridClass = isDetailedMonthView
        ? "calendar-grid calendar-grid--with-weeknumbers calendar-grid--detailed"
        : "calendar-grid calendar-grid--with-weeknumbers";

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
                    const detailedClass = isDetailedMonthView ? " calendar-day--detailed" : "";
                    const dayEntries = getEntriesForDate(planningEntries, day.isoDate);
                    const hasEntriesClass = dayEntries.length > 0 ? " calendar-day--has-entries" : "";

                    const entryIndicatorsHtml = isDetailedMonthView
                        ? renderDetailedEntries(dayEntries, persons, categories)
                        : `
              <span class="calendar-entry-dots">
                ${dayEntries
                            .slice(0, 3)
                            .map((entry) => {
                                const person = getPersonById(persons, entry.personId);
                                const color = person?.color ?? "#9ca3af";

                                return `<span class="calendar-entry-dot" style="background-color: ${color};"></span>`;
                            })
                            .join("")}
              </span>
            `;

                    const holidayLabel = day.holidayName
                        ? `<span class="calendar-day__holiday">${day.holidayName}</span>`
                        : "";

                    return `
            <button
              class="calendar-day${weekendClass}${holidayClass}${selectedClass}${hasEntriesClass}${detailedClass}"
              data-date="${day.isoDate}"
              type="button"
            >
              <span class="calendar-day__number">${day.dayOfMonth}</span>
              ${holidayLabel}
              ${entryIndicatorsHtml}
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
    <article class="${cardClass}">
      <h3>${month.monthName}</h3>

      <div class="${gridClass}">
        ${weekdayHeaderHtml}
        ${weekRowsHtml}
      </div>
    </article>
  `;
}