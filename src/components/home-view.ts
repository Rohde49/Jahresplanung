import type { Category } from "../models/category";
import type { Person } from "../models/person";

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

interface RenderHomeViewOptions {
    persons: Person[];
    categories: Category[];
}

export function renderHomeView(): string {
    return `
    <section class="card">
      <div class="section-header">
        <h2>Startseite</h2>
        <p>Starte den Jahresplaner oder lade eine bestehende Planung.</p>
      </div>

      <div class="home-grid home-grid--single">
        <article class="card home-card">
          <h3>Planer</h3>
          <p>Erstelle eine neue Jahresplanung oder lade eine bestehende Datei.</p>

          <div class="home-actions">
            <button class="primary-button" id="create-planner-button" type="button">
              Neu erstellen
            </button>
            <button class="secondary-button" id="load-planner-button" type="button">
              Laden
            </button>
          </div>
        </article>
      </div>
    </section>
  `;
}