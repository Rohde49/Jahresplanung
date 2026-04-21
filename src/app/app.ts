import { renderToolbar } from "../components/toolbar";
import { renderMonthCard } from "../components/month-card";
import { renderDetailsPanel } from "../components/details-panel";

import { type CalendarDay, type CalendarMonth } from "../models/calendar";
import type { AppStorageData } from "../models/app-storage";
import { type PlanningEntry } from "../models/planning-entry";

import { createCalendarYear } from "../utils/date-utils";

import {
    chooseAndLoadPlanningFile,
    chooseSaveFilePath,
    writePlanningFile,
} from "../services/storage-service";

import {
    AVAILABLE_YEARS,
    currentFilePath,
    persons,
    planningEntries,
    selectedDateIso,
    selectedYear,
    setCurrentFilePath,
} from "./state";
import { applyLoadedData } from "./actions";
import { attachEventHandlers } from "./handlers";

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

function createStorageData(): AppStorageData {
    return {
        selectedYear,
        persons,
        planningEntries,
    };
}

async function savePlanningDataAs(): Promise<void> {
    const filePath = await chooseSaveFilePath(selectedYear);

    if (!filePath) {
        return;
    }

    await writePlanningFile(filePath, createStorageData());
    setCurrentFilePath(filePath);
}

async function savePlanningData(): Promise<void> {
    if (!currentFilePath) {
        await savePlanningDataAs();
        return;
    }

    await writePlanningFile(currentFilePath, createStorageData());
}

async function loadPlanningData(): Promise<void> {
    const result = await chooseAndLoadPlanningFile();

    if (!result) {
        return;
    }

    applyLoadedData(result.filePath, result.data);
    renderApp();
}

export function renderApp(): void {
    const app = document.querySelector<HTMLDivElement>("#app");

    if (!app) {
        throw new Error("App root element '#app' wurde nicht gefunden.");
    }

    const calendarYear = createCalendarYear(selectedYear);
    const selectedDay = findSelectedDay(calendarYear.months, selectedDateIso);

    const monthCardsHtml = calendarYear.months
        .map((month) =>
            renderMonthCard({
                month,
                selectedDateIso,
                planningEntries,
                persons,
            }),
        )
        .join("");

    const detailsEntries = selectedDay ? getEntriesForDate(selectedDay.isoDate) : [];

    const detailsPanelHtml = renderDetailsPanel({
        selectedDay,
        persons,
        entries: detailsEntries,
    });

    const fileInfo = currentFilePath
        ? `<p class="file-info">Aktuelle Datei: ${currentFilePath}</p>`
        : `<p class="file-info">Noch keine Datei geladen oder gespeichert</p>`;

    app.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <h1>Software-Jahresplanung</h1>
        <p class="app-subtitle">Desktopanwendung zur Jahresplanung für Teams</p>
      </header>

      <main class="app-content">
        <section class="card">
          ${renderToolbar({
        availableYears: AVAILABLE_YEARS,
        selectedYear,
    })}

          ${fileInfo}

          <div class="section-header">
            <h2>Jahresübersicht ${calendarYear.year}</h2>
            <p>Kalender mit Feiertagen, Tagesauswahl, Personen und Planeinträgen</p>
          </div>

          <div class="layout-grid">
            <div class="month-grid">
              ${monthCardsHtml}
            </div>

            ${detailsPanelHtml}
          </div>
        </section>
      </main>
    </div>
  `;

    attachEventHandlers({
        onRender: renderApp,
        onSave: savePlanningData,
        onSaveAs: savePlanningDataAs,
        onLoad: loadPlanningData,
    });
}