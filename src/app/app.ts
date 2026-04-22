import { applyLoadedData } from "./actions";
import { attachEventHandlers } from "./handlers";
import {
    categories,
    currentView,
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
import { renderHomeView } from "../components/home-view";

function createStorageData(): AppStorageData {
    return {
        selectedYear,
        persons,
        categories,
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
    await savePlanningDataAs();
}

async function loadPlanningData(): Promise<void> {
    const result = await chooseAndLoadPlanningFile();

    if (!result) {
        return;
    }

    applyLoadedData(result.filePath, result.data);
    renderApp();
}

function renderCurrentView(): string {
    if (currentView === "planner") {
        return renderYearView();
    }

    return renderHomeView();
}

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
        ${renderCurrentView()}
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