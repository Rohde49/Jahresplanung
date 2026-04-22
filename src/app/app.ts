import { applyLoadedData } from "./actions";
import { attachEventHandlers } from "./handlers";
import {
    categories,
    currentFilePath,
    persons,
    planningEntries,
    selectedYear,
    setCurrentFilePath,
} from "./state";

import type { AppStorageData } from "../models/app-storage";

import {
    chooseAndLoadPlanningFile,
    chooseSaveFilePath,
    writePlanningFile,
} from "../services/storage-service";

import { renderYearView } from "../components/year-view";

// Erstellt das aktuelle Datenobjekt, das als JSON gespeichert wird.
function createStorageData(): AppStorageData {
    return {
        selectedYear,
        persons,
        categories,
        planningEntries,
    };
}

// Öffnet einen "Speichern unter"-Dialog und speichert die aktuellen Daten in die gewählte Datei.
async function savePlanningDataAs(): Promise<void> {
    const filePath = await chooseSaveFilePath(selectedYear);

    // Abbrechen, falls der Nutzer keinen Speicherort auswählt.
    if (!filePath) {
        return;
    }

    await writePlanningFile(filePath, createStorageData());
    setCurrentFilePath(filePath);
}

// Speichert direkt in die aktuell geöffnete Datei.
// Falls noch keine Datei bekannt ist, wird automatisch "Speichern unter" verwendet.
async function savePlanningData(): Promise<void> {
    if (!currentFilePath) {
        await savePlanningDataAs();
        return;
    }

    await writePlanningFile(currentFilePath, createStorageData());
}

// Öffnet einen Dateidialog, lädt die gespeicherten Planungsdaten
// und übernimmt sie in den aktuellen App-Zustand.
async function loadPlanningData(): Promise<void> {
    const result = await chooseAndLoadPlanningFile();

    // Abbrechen, falls keine Datei ausgewählt wurde.
    if (!result) {
        return;
    }

    applyLoadedData(result.filePath, result.data);
    renderApp();
}

// Rendert die komplette Anwendung neu in das #app-Element.
export function renderApp(): void {
    const app = document.querySelector<HTMLDivElement>("#app");

    if (!app) {
        throw new Error("App root element '#app' wurde nicht gefunden.");
    }

    app.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <h1>Software-Jahresplanung</h1>
        <p class="app-subtitle">Desktopanwendung zur Jahresplanung für Teams</p>
      </header>

      <main class="app-content">
        ${renderYearView()}
      </main>
    </div>
  `;

    // Bindet nach jedem Rendern alle benötigten Event-Listener erneut an.
    attachEventHandlers({
        onRender: renderApp,
        onSave: savePlanningData,
        onSaveAs: savePlanningDataAs,
        onLoad: loadPlanningData,
    });
}