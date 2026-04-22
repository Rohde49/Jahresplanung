import type { CalendarDay } from "../models/calendar";
import type { Category } from "../models/category";
import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";

interface RenderDayModalOptions {
    selectedDay: CalendarDay | null;
    persons: Person[];
    categories: Category[];
    entries: PlanningEntry[];
    isOpen: boolean;
}

function formatSelectedDate(day: CalendarDay): string {
    return `${day.dayOfMonth}. ${day.monthIndex + 1}. ${day.year}`;
}

function renderCategoryOptions(categories: Category[]): string {
    if (categories.length === 0) {
        return `<option value="">Keine Kategorie vorhanden</option>`;
    }

    return categories
        .map((category) => `<option value="${category.id}">${category.name}</option>`)
        .join("");
}

function renderPersonOptions(persons: Person[]): string {
    if (persons.length === 0) {
        return `<option value="">Keine Person vorhanden</option>`;
    }

    return persons
        .map((person) => `<option value="${person.id}">${person.name}</option>`)
        .join("");
}

function getPersonById(persons: Person[], personId: string): Person | undefined {
    return persons.find((person) => person.id === personId);
}

function getCategoryById(categories: Category[], categoryId: string): Category | undefined {
    return categories.find((category) => category.id === categoryId);
}

function renderEntriesList(
    entries: PlanningEntry[],
    persons: Person[],
    categories: Category[],
): string {
    if (entries.length === 0) {
        return `<p class="empty-state">Für diesen Tag gibt es noch keine Einträge.</p>`;
    }

    const itemsHtml = entries
        .map((entry) => {
            const person = getPersonById(persons, entry.personId);
            const category = getCategoryById(categories, entry.categoryId);
            const personName = person?.name ?? "Unbekannte Person";
            const personColor = person?.color ?? "#9ca3af";
            const categoryName = category?.name ?? "Unbekannte Kategorie";

            return `
        <li class="entry-item">
          <span class="entry-item__color" style="background-color: ${personColor};"></span>
          <div class="entry-item__content">
            <strong>${entry.title}</strong>
            <span>${categoryName} · ${personName}</span>
          </div>
          <button
            class="entry-item__delete"
            type="button"
            data-entry-id="${entry.id}"
            aria-label="Eintrag löschen"
          >
            Löschen
          </button>
        </li>
      `;
        })
        .join("");

    return `<ul class="entry-list">${itemsHtml}</ul>`;
}

export function renderDayModal({
                                   selectedDay,
                                   persons,
                                   categories,
                                   entries,
                                   isOpen,
                               }: RenderDayModalOptions): string {
    if (!isOpen || !selectedDay) {
        return "";
    }

    const personSelectDisabled = persons.length === 0 ? "disabled" : "";
    const categorySelectDisabled = categories.length === 0 ? "disabled" : "";
    const submitDisabled = persons.length === 0 || categories.length === 0 ? "disabled" : "";

    return `
    <div class="modal-overlay" id="day-modal-overlay">
      <div class="day-modal" role="dialog" aria-modal="true" aria-labelledby="day-modal-title">
        <div class="day-modal__header">
          <div class="day-modal__heading">
            <h2 id="day-modal-title">Tagesdetails</h2>
            <p class="day-modal__subtitle">${formatSelectedDate(selectedDay)}</p>
          </div>

          <button
            class="day-modal__close"
            id="close-day-modal-button"
            type="button"
            aria-label="Modal schließen"
          >
            ✕
          </button>
        </div>

        <div class="day-modal__section">
          <div class="details-grid">
            <div class="detail-card">
              <span class="detail-card__label">Wochentag</span>
              <span class="detail-card__value">${selectedDay.weekday}</span>
            </div>

            <div class="detail-card">
              <span class="detail-card__label">Feiertag</span>
              <span class="detail-card__value">${selectedDay.holidayName ?? "—"}</span>
            </div>

            <div class="detail-card">
              <span class="detail-card__label">Wochenende</span>
              <span class="detail-card__value">${selectedDay.isWeekend ? "Ja" : "Nein"}</span>
            </div>
          </div>
        </div>

        <div class="day-modal__section entry-editor">
          <h3>Eintrag hinzufügen</h3>

          <form id="entry-form" class="entry-form">
            <div class="form-group">
              <label for="entry-title">Titel</label>
              <input
                id="entry-title"
                name="title"
                type="text"
                placeholder="z. B. Urlaub Anna"
                required
              />
            </div>

            <div class="form-group">
              <label for="entry-category">Kategorie</label>
              <select id="entry-category" name="categoryId" ${categorySelectDisabled}>
                ${renderCategoryOptions(categories)}
              </select>
            </div>

            <div class="form-group">
              <label for="entry-person">Person</label>
              <select id="entry-person" name="personId" ${personSelectDisabled}>
                ${renderPersonOptions(persons)}
              </select>
            </div>

            <button class="primary-button day-modal__submit" type="submit" ${submitDisabled}>
              Eintrag hinzufügen
            </button>
          </form>
        </div>

        <div class="day-modal__section entry-section">
          <h3>Einträge</h3>
          ${renderEntriesList(entries, persons, categories)}
        </div>
      </div>
    </div>
  `;
}