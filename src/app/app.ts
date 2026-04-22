import { applyLoadedData } from "./actions";
import { attachEventHandlers } from "./handlers";
import {
    categories,
    currentFilePath,
    persons,
    planningEntries,
    printViewMode,
    selectedMonthIndex,
    selectedYear,
    setCurrentFilePath,
    setPrintViewMode,
} from "./state";

import type { AppStorageData } from "../models/app-storage";

import {
    chooseAndLoadPlanningFile,
    chooseSaveFilePath,
    writePlanningFile,
} from "../services/storage-service";

import { renderYearView } from "../components/year-view";
import { renderPrintView } from "../components/print-view";

// Baut das aktuelle Speicherobjekt für JSON-Export/Import.
function createStorageData(): AppStorageData {
    return {
        selectedYear,
        persons,
        categories,
        planningEntries,
    };
}

// "Speichern unter": Nutzer wählt Dateipfad, danach werden die Daten dorthin geschrieben.
async function savePlanningDataAs(): Promise<void> {
    const filePath = await chooseSaveFilePath(selectedYear);

    if (!filePath) {
        return;
    }

    await writePlanningFile(filePath, createStorageData());
    setCurrentFilePath(filePath);
}

// Normales Speichern: nutzt vorhandenen Dateipfad, sonst automatisch "Speichern unter".
async function savePlanningData(): Promise<void> {
    if (!currentFilePath) {
        await savePlanningDataAs();
        return;
    }

    await writePlanningFile(currentFilePath, createStorageData());
}

// Lädt eine gespeicherte Datei und übernimmt deren Daten in den aktuellen Zustand.
async function loadPlanningData(): Promise<void> {
    const result = await chooseAndLoadPlanningFile();

    if (!result) {
        return;
    }

    applyLoadedData(result.filePath, result.data);
    renderApp();
}

// Aktiviert kurz die Druckansicht und öffnet dann den Druckdialog.
async function printCurrentMonth(): Promise<void> {
    setPrintViewMode("month");
    renderApp();

    // Kleiner Tick, damit DOM/CSS sicher aktualisiert sind.
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    window.print();

    setPrintViewMode("none");
    renderApp();
}

// Rendert die App entweder normal oder in der Druckansicht.
export function renderApp(): void {
    const app = document.querySelector<HTMLDivElement>("#app");

    if (!app) {
        throw new Error("App root element '#app' wurde nicht gefunden.");
    }

    const mainContent =
        printViewMode === "month"
            ? renderPrintView({
                year: selectedYear,
                monthIndex: selectedMonthIndex,
                planningEntries,
                persons,
                categories,
            })
            : `
        <header class="app-header">
          <h1>Software-Jahresplanung</h1>
          <p class="app-subtitle">Desktopanwendung zur Jahresplanung für Teams</p>
        </header>

        <main class="app-content">
          ${renderYearView()}
        </main>
      `;

    app.innerHTML = `
    <div class="app-shell ${printViewMode !== "none" ? "app-shell--print" : ""}">
      ${mainContent}
    </div>
  `;

    // In der Druckansicht keine normalen Event-Handler binden.
    if (printViewMode === "none") {
        attachEventHandlers({
            onRender: renderApp,
            onSave: savePlanningData,
            onSaveAs: savePlanningDataAs,
            onLoad: loadPlanningData,
            onPrintCurrentMonth: printCurrentMonth,
        });
    }
}