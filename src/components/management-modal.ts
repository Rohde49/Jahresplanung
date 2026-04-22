import type { Category } from "../models/category";
import type { Person } from "../models/person";
import type { ManagementModalMode } from "../app/state";

interface RenderManagementModalOptions {
    mode: ManagementModalMode;
    persons: Person[];
    categories: Category[];
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

function renderCategoriesList(categories: Category[]): string {
    if (categories.length === 0) {
        return `<p class="empty-state">Es wurden noch keine Kategorien angelegt.</p>`;
    }

    const itemsHtml = categories
        .map((category) => {
            return `
        <li class="entry-item">
          <div class="entry-item__content">
            <strong>${category.name}</strong>
          </div>
          <button
            class="entry-item__delete"
            type="button"
            data-category-id="${category.id}"
            aria-label="Kategorie löschen"
          >
            Löschen
          </button>
        </li>
      `;
        })
        .join("");

    return `<ul class="entry-list">${itemsHtml}</ul>`;
}

export function renderManagementModal({
                                          mode,
                                          persons,
                                          categories,
                                      }: RenderManagementModalOptions): string {
    if (!mode) {
        return "";
    }

    const isTeam = mode === "team";
    const title = isTeam ? "Team verwalten" : "Kategorien verwalten";

    const formHtml = isTeam
        ? `
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
    `
        : `
      <form id="category-form" class="entry-form">
        <div class="form-group">
          <label for="category-name">Name</label>
          <input id="category-name" name="name" type="text" placeholder="z. B. Fortbildung" required />
        </div>

        <button class="primary-button" type="submit">Kategorie anlegen</button>
      </form>
    `;

    const listHtml = isTeam
        ? renderPersonsList(persons)
        : renderCategoriesList(categories);

    return `
    <div class="modal-overlay" id="management-modal-overlay">
      <div class="day-modal" role="dialog" aria-modal="true" aria-labelledby="management-modal-title">
        <div class="day-modal__header">
          <div>
            <h2 id="management-modal-title">${title}</h2>
          </div>

          <button
            class="secondary-button day-modal__close"
            id="close-management-modal-button"
            type="button"
            aria-label="Modal schließen"
          >
            ✕
          </button>
        </div>

        ${formHtml}

        <div class="entry-section">
          ${listHtml}
        </div>
      </div>
    </div>
  `;
}