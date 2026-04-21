import type { EntryCategory } from "../models/planning-entry";
import {
    addPerson,
    addPlanningEntry,
    changeSelectedYear,
    deletePerson,
    deletePlanningEntry,
    selectDate,
} from "./actions";

interface AttachEventHandlersOptions {
    onRender: () => void;
    onSave: () => Promise<void>;
    onSaveAs: () => Promise<void>;
    onLoad: () => Promise<void>;
}

export function attachEventHandlers({
                                        onRender,
                                        onSave,
                                        onSaveAs,
                                        onLoad,
                                    }: AttachEventHandlersOptions): void {
    const yearSelect = document.querySelector<HTMLSelectElement>("#year-select");

    if (yearSelect) {
        yearSelect.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            changeSelectedYear(Number(target.value));
            onRender();
        });
    }

    const dayButtons = document.querySelectorAll<HTMLButtonElement>(".calendar-day[data-date]");

    dayButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectDate(button.dataset.date ?? null);
            onRender();
        });
    });

    const entryForm = document.querySelector<HTMLFormElement>("#entry-form");

    if (entryForm) {
        entryForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const selectedDateIso = document
                .querySelector<HTMLButtonElement>(".calendar-day--selected")
                ?.dataset.date;

            if (!selectedDateIso) {
                return;
            }

            const formData = new FormData(entryForm);
            const title = String(formData.get("title") ?? "");
            const category = String(formData.get("category") ?? "Sonstiges") as EntryCategory;
            const personId = String(formData.get("personId") ?? "");

            addPlanningEntry({
                dateIso: selectedDateIso,
                title,
                category,
                personId,
            });

            onRender();
        });
    }

    const personForm = document.querySelector<HTMLFormElement>("#person-form");

    if (personForm) {
        personForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(personForm);
            const name = String(formData.get("name") ?? "");
            const color = String(formData.get("color") ?? "#4f46e5");

            addPerson({ name, color });
            onRender();
        });
    }

    const deleteEntryButtons = document.querySelectorAll<HTMLButtonElement>("[data-entry-id]");

    deleteEntryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const entryId = button.dataset.entryId;

            if (!entryId) {
                return;
            }

            deletePlanningEntry(entryId);
            onRender();
        });
    });

    const deletePersonButtons = document.querySelectorAll<HTMLButtonElement>("[data-person-id]");

    deletePersonButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const personId = button.dataset.personId;

            if (!personId) {
                return;
            }

            deletePerson(personId);
            onRender();
        });
    });

    const saveButton = document.querySelector<HTMLButtonElement>("#save-button");
    const saveAsButton = document.querySelector<HTMLButtonElement>("#save-as-button");
    const loadButton = document.querySelector<HTMLButtonElement>("#load-button");

    if (saveButton) {
        saveButton.addEventListener("click", async () => {
            try {
                await onSave();
            } catch (error) {
                console.error("Fehler beim Speichern:", error);
                alert(`Die Datei konnte nicht gespeichert werden: ${String(error)}`);
            }
        });
    }

    if (saveAsButton) {
        saveAsButton.addEventListener("click", async () => {
            try {
                await onSaveAs();
            } catch (error) {
                console.error("Fehler beim Speichern unter:", error);
                alert(`Die Datei konnte nicht gespeichert werden: ${String(error)}`);
            }
        });
    }

    if (loadButton) {
        loadButton.addEventListener("click", async () => {
            try {
                await onLoad();
            } catch (error) {
                console.error("Fehler beim Laden:", error);
                alert(`Die Datei konnte nicht geladen werden: ${String(error)}`);
            }
        });
    }
}