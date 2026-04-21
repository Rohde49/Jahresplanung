interface RenderToolbarOptions {
    availableYears: number[];
    selectedYear: number;
}

function renderYearOptions(availableYears: number[], selectedYear: number): string {
    return availableYears
        .map((year) => {
            const selectedAttribute = year === selectedYear ? "selected" : "";
            return `<option value="${year}" ${selectedAttribute}>${year}</option>`;
        })
        .join("");
}

export function renderToolbar({
                                  availableYears,
                                  selectedYear,
                              }: RenderToolbarOptions): string {
    return `
    <div class="toolbar toolbar--top">
      <div class="toolbar__group">
        <label class="toolbar__label" for="year-select">Jahr</label>
        <select class="toolbar__select" id="year-select">
          ${renderYearOptions(availableYears, selectedYear)}
        </select>
      </div>

      <div class="toolbar__actions">
        <button class="secondary-button" id="load-button" type="button">Laden</button>
        <button class="secondary-button" id="save-as-button" type="button">Speichern unter</button>
        <button class="primary-button" id="save-button" type="button">Speichern</button>
      </div>
    </div>
  `;
}