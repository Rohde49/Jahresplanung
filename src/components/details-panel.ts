import type { CalendarDay } from "../models/calendar";
import type { Person } from "../models/person";
import {
    ENTRY_CATEGORIES,
    type PlanningEntry,
} from "../models/planning-entry";

interface RenderDetailsPanelOptions {
    selectedDay: CalendarDay | null;
    persons: Person[];
    entries: PlanningEntry[];
}

function formatSelectedDate(day: CalendarDay): string {
    return `${day.dayOfMonth}. ${day.monthIndex + 1}. ${day.year}`;
}

function renderCategoryOptions(): string {
    return ENTRY_CATEGORIES.map((category) => {
        return `<option value="${category}">${category}</option>`;
    }).join("");
}

function renderPersonOptions(persons: Person[]): string {
    if (persons.length === 0) {
        return `<option value="">Keine Person vorhanden</option>`;
    }

    return persons
        .map((person) => `<option value="${person.id}">${person.name}</option>`)
        .join("");
}

function renderPersonsList(persons: Person[]): string {
    if (persons.length === 0) {
        return `<p class="empty-state">Es wurden noch keine Personen angelegt.</p>`;
    }

    const itemsHtml = persons
        .map((person) => {
            return `
        <li class="entry-item">
          <span class="entry-item__color" style="background-color: ${person.color};"></span>
          <div class="entry-item__content">
            <strong>${person.name}</strong>
            <span>${person.color}</span>
          </div>
          <button
            class="entry-item__delete"
            type="button"
            data-person-id="${person.id}"
            aria-label="Person löschen"
          >
            Löschen
          </button>
        </li>
      `;
        })
        .join("");

    return `<ul class="entry-list">${itemsHtml}</ul>`;
}

function getPersonById(persons: Person[], personId: string): Person | undefined {
    return persons.find((person) => person.id === personId);
}

function renderEntriesList(entries: PlanningEntry[], persons: Person[]): string {
    if (entries.length === 0) {
        return `<p class="empty-state">Für diesen Tag gibt es noch keine Einträge.</p>`;
    }

    const itemsHtml = entries
        .map((entry) => {
            const person = getPersonById(persons, entry.personId);
            const personName = person?.name ?? "Unbekannte Person";
            const personColor = person?.color ?? "#9ca3af";

            return `
        <li class="entry-item">
          <span class="entry-item__color" style="background-color: ${personColor};"></span>
          <div class="entry-item__content">
            <strong>${entry.title}</strong>
            <span>${entry.category} · ${personName}</span>
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

export function renderDetailsPanel({
                                       selectedDay,
                                       persons,
                                       entries,
                                   }: RenderDetailsPanelOptions): string {
    if (!selectedDay) {
        return `
      <aside class="details-panel card">
        <h2>Tagesdetails</h2>
        <p>Wähle einen Tag im Kalender aus, um Details anzuzeigen.</p>

        <div class="entry-editor">
          <h3>Personenverwaltung</h3>

          <form id="person-form" class="entry-form">
            <div class="form-group">
              <label for="person-name">Name</label>
              <input id="person-name" name="name" type="text" placeholder="z. B. Anna" required />
            </div>

            <div class="form-group">
              <label for="person-color">Farbe</label>
              <input id="person-color" name="color" type="color" value="#4f46e5" />
            </div>

            <button class="primary-button" type="submit">Person anlegen</button>
          </form>
        </div>

        <div class="entry-section">
          <h3>Personen</h3>
          ${renderPersonsList(persons)}
        </div>
      </aside>
    `;
    }

    const personSelectDisabled = persons.length === 0 ? "disabled" : "";

    return `
    <aside class="details-panel card">
      <h2>Tagesdetails</h2>

      <div class="details-list">
        <div class="details-item">
          <span class="details-item__label">Datum</span>
          <span class="details-item__value">${formatSelectedDate(selectedDay)}</span>
        </div>

        <div class="details-item">
          <span class="details-item__label">Wochentag</span>
          <span class="details-item__value">${selectedDay.weekday}</span>
        </div>

        <div class="details-item">
          <span class="details-item__label">Feiertag</span>
          <span class="details-item__value">${selectedDay.holidayName ?? "—"}</span>
        </div>

        <div class="details-item">
          <span class="details-item__label">Wochenende</span>
          <span class="details-item__value">${selectedDay.isWeekend ? "Ja" : "Nein"}</span>
        </div>
      </div>

      <div class="entry-editor">
        <h3>Eintrag hinzufügen</h3>

        <form id="entry-form" class="entry-form">
          <div class="form-group">
            <label for="entry-title">Titel</label>
            <input id="entry-title" name="title" type="text" placeholder="z. B. Urlaub Anna" required />
          </div>

          <div class="form-group">
            <label for="entry-category">Kategorie</label>
            <select id="entry-category" name="category">
              ${renderCategoryOptions()}
            </select>
          </div>

          <div class="form-group">
            <label for="entry-person">Person</label>
            <select id="entry-person" name="personId" ${personSelectDisabled}>
              ${renderPersonOptions(persons)}
            </select>
          </div>

          <button class="primary-button" type="submit" ${personSelectDisabled}>
            Eintrag hinzufügen
          </button>
        </form>
      </div>

      <div class="entry-section">
        <h3>Einträge</h3>
        ${renderEntriesList(entries, persons)}
      </div>

      <div class="entry-section">
        <h3>Personenverwaltung</h3>

        <form id="person-form" class="entry-form">
          <div class="form-group">
            <label for="person-name">Name</label>
            <input id="person-name" name="name" type="text" placeholder="z. B. Anna" required />
          </div>

          <div class="form-group">
            <label for="person-color">Farbe</label>
            <input id="person-color" name="color" type="color" value="#4f46e5" />
          </div>

          <button class="primary-button" type="submit">Person anlegen</button>
        </form>

        <div class="person-list-wrapper">
          ${renderPersonsList(persons)}
        </div>
      </div>
    </aside>
  `;
}