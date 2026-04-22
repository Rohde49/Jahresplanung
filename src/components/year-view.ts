import { renderToolbar } from "./toolbar";
import { renderMonthCard } from "./month-card";
import { renderDayModal } from "./day-modal";
import { renderManagementModal } from "./management-modal";

import { type CalendarDay, type CalendarMonth } from "../models/calendar";
import { type PlanningEntry } from "../models/planning-entry";

import { createCalendarYear } from "../utils/date-utils";

import {
    AVAILABLE_YEARS,
    categories,
    isDayModalOpen,
    managementModalMode,
    persons,
    plannerViewMode,
    planningEntries,
    selectedDateIso,
    selectedMonthIndex,
    selectedYear,
} from "../app/state";

function findSelectedDay(months: CalendarMonth[], isoDate: string | null): CalendarDay | null {
    if (!isoDate) {
        return null;
    }

    for (const month of months) {
        const foundDay = month.days.find((day) => day.isoDate === isoDate);

        if (foundDay) {
            return foundDay;
        }
    }

    return null;
}

function getEntriesForDate(dateIso: string): PlanningEntry[] {
    return planningEntries.filter((entry) => entry.dateIso === dateIso);
}

export function renderYearView(): string {
    const calendarYear = createCalendarYear(selectedYear);
    const selectedDay = findSelectedDay(calendarYear.months, selectedDateIso);

    const visibleMonths =
        plannerViewMode === "month"
            ? [calendarYear.months[selectedMonthIndex]]
            : calendarYear.months;

    const monthCardsHtml = visibleMonths
        .map((month) =>
            renderMonthCard({
                month,
                selectedDateIso,
                planningEntries,
                persons,
                categories,
                isDetailedMonthView: plannerViewMode === "month",
            }),
        )
        .join("");

    const detailsEntries = selectedDay ? getEntriesForDate(selectedDay.isoDate) : [];

    const dayModalHtml = renderDayModal({
        selectedDay,
        persons,
        categories,
        entries: detailsEntries,
        isOpen: isDayModalOpen,
    });

    const managementModalHtml = renderManagementModal({
        mode: managementModalMode,
        persons,
        categories,
    });

    return `
    <section class="card">
      <div class="section-header section-header--planner">
        <h2>Jahresübersicht ${calendarYear.year}</h2>
      </div>

      ${renderToolbar({
        availableYears: AVAILABLE_YEARS,
        selectedYear,
        plannerViewMode,
        selectedMonthIndex,
    })}

      <div class="month-grid ${plannerViewMode === "month" ? "month-grid--single" : ""}">
        ${monthCardsHtml}
      </div>
    </section>

    ${dayModalHtml}
    ${managementModalHtml}
  `;
}