import { MONTH_NAMES } from "../models/calendar";
import type { PlannerViewMode } from "../app/state";

interface RenderToolbarOptions {
    availableYears: number[];
    selectedYear: number;
    plannerViewMode: PlannerViewMode;
    selectedMonthIndex: number;
}

function renderYearOptions(availableYears: number[], selectedYear: number): string {
    return availableYears
        .map((year) => {
            const selectedAttribute = year === selectedYear ? "selected" : "";
            return `<option value="${year}" ${selectedAttribute}>${year}</option>`;
        })
        .join("");
}

function renderMonthOptions(selectedMonthIndex: number): string {
    return MONTH_NAMES.map((monthName, index) => {
        const selectedAttribute = index === selectedMonthIndex ? "selected" : "";
        return `<option value="${index}" ${selectedAttribute}>${monthName}</option>`;
    }).join("");
}

export function renderToolbar({
                                  availableYears,
                                  selectedYear,
                                  plannerViewMode,
                                  selectedMonthIndex,
                              }: RenderToolbarOptions): string {
    const monthControlsDisabled = plannerViewMode === "month" ? "" : "disabled";

    return `
    <div class="toolbar toolbar--planner">
      <div class="toolbar__center">
        <div class="toolbar__group">
          <label class="toolbar__label" for="year-select">Jahr</label>
          <select class="toolbar__select" id="year-select">
            ${renderYearOptions(availableYears, selectedYear)}
          </select>
        </div>

        <div class="toolbar__group">
          <label class="toolbar__label" for="planner-view-mode">Ansicht</label>
          <select class="toolbar__select" id="planner-view-mode">
            <option value="year" ${plannerViewMode === "year" ? "selected" : ""}>Jahresübersicht</option>
            <option value="month" ${plannerViewMode === "month" ? "selected" : ""}>Monatsansicht</option>
          </select>
        </div>

        <div class="toolbar__group toolbar__group--month">
          <label class="toolbar__label" for="month-select">Monat</label>
          <select class="toolbar__select" id="month-select" ${monthControlsDisabled}>
            ${renderMonthOptions(selectedMonthIndex)}
          </select>
        </div>
      </div>

      <div class="toolbar__right">
        <details class="toolbar-menu">
          <summary class="secondary-button toolbar-menu__summary">Aktionen ▾</summary>

          <div class="toolbar-menu__content">
            <button class="toolbar-menu__item" id="print-current-month-button" type="button">Monat drucken</button>
            <button class="toolbar-menu__item" id="load-button" type="button">Datei Laden</button>
            <button class="toolbar-menu__item" id="save-as-button" type="button">Speichern unter</button>
            <button class="toolbar-menu__item" id="save-button" type="button">Datei speichern</button>
            <button class="toolbar-menu__item" id="open-team-modal-button" type="button">Team verwalten</button>
            <button class="toolbar-menu__item" id="open-categories-modal-button" type="button">Kategorien verwalten</button>
          </div>
        </details>
      </div>
    </div>
  `;
}