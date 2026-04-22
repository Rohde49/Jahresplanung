import {
    addCategory,
    addPerson,
    addPlanningEntry,
    changeSelectedYear,
    closeSelectedDayModal,
    closeSelectedManagementModal,
    deleteCategory,
    deletePerson,
    deletePlanningEntry,
    openCategoryManagementModal,
    openTeamManagementModal,
    selectDate,
} from "./actions";
import {
    setPlannerViewMode,
    setSelectedMonthIndex,
} from "./state";

// Beschreibt die Funktionen, die von außen an die Event-Handler übergeben werden.
interface AttachEventHandlersOptions {
    onRender: () => void;
    onSave: () => Promise<void>;
    onSaveAs: () => Promise<void>;
    onLoad: () => Promise<void>;
}

// Verknüpft alle interaktiven Elemente der Oberfläche mit ihrer Logik.
export function attachEventHandlers({
                                        onRender,
                                        onSave,
                                        onSaveAs,
                                        onLoad,
                                    }: AttachEventHandlersOptions): void {
    const openTeamModalButton = document.querySelector<HTMLButtonElement>("#open-team-modal-button");
    const openCategoriesModalButton = document.querySelector<HTMLButtonElement>("#open-categories-modal-button");

    // Öffnet das Team-Verwaltungsmodal.
    if (openTeamModalButton) {
        openTeamModalButton.addEventListener("click", () => {
            openTeamManagementModal();
            onRender();
        });
    }

    // Öffnet das Kategorien-Verwaltungsmodal.
    if (openCategoriesModalButton) {
        openCategoriesModalButton.addEventListener("click", () => {
            openCategoryManagementModal();
            onRender();
        });
    }

    const yearSelect = document.querySelector<HTMLSelectElement>("#year-select");

    // Reagiert auf die Änderung des ausgewählten Jahres.
    if (yearSelect) {
        yearSelect.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            changeSelectedYear(Number(target.value));
            onRender();
        });
    }

    const plannerViewModeSelect =
        document.querySelector<HTMLSelectElement>("#planner-view-mode");

    // Wechselt zwischen Jahres- und Monatsansicht.
    if (plannerViewModeSelect) {
        plannerViewModeSelect.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            setPlannerViewMode(target.value as "year" | "month");
            onRender();
        });
    }

    const monthSelect = document.querySelector<HTMLSelectElement>("#month-select");

    // Ändert den aktuell ausgewählten Monat in der Monatsansicht.
    if (monthSelect) {
        monthSelect.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            setSelectedMonthIndex(Number(target.value));
            onRender();
        });
    }

    const dayButtons = document.querySelectorAll<HTMLButtonElement>(".calendar-day[data-date]");

    // Öffnet beim Klick auf einen Tag das Tages-Modal.
    dayButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectDate(button.dataset.date ?? null);
            onRender();
        });
    });

    const closeDayModalButton =
        document.querySelector<HTMLButtonElement>("#close-day-modal-button");
    const dayModalOverlay = document.querySelector<HTMLDivElement>("#day-modal-overlay");

    // Schließt das Tages-Modal per Schließen-Button.
    if (closeDayModalButton) {
        closeDayModalButton.addEventListener("click", () => {
            closeSelectedDayModal();
            onRender();
        });
    }

    // Schließt das Tages-Modal per Klick auf den Hintergrund.
    if (dayModalOverlay) {
        dayModalOverlay.addEventListener("click", (event) => {
            if (event.target === dayModalOverlay) {
                closeSelectedDayModal();
                onRender();
            }
        });
    }

    const closeManagementModalButton =
        document.querySelector<HTMLButtonElement>("#close-management-modal-button");
    const managementModalOverlay =
        document.querySelector<HTMLDivElement>("#management-modal-overlay");

    // Schließt das Verwaltungs-Modal per Schließen-Button.
    if (closeManagementModalButton) {
        closeManagementModalButton.addEventListener("click", () => {
            closeSelectedManagementModal();
            onRender();
        });
    }

    // Schließt das Verwaltungs-Modal per Klick auf den Hintergrund.
    if (managementModalOverlay) {
        managementModalOverlay.addEventListener("click", (event) => {
            if (event.target === managementModalOverlay) {
                closeSelectedManagementModal();
                onRender();
            }
        });
    }

    // Schließt offene Modals mit der Escape-Taste.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSelectedDayModal();
            closeSelectedManagementModal();
            onRender();
        }
    });

    const entryForm = document.querySelector<HTMLFormElement>("#entry-form");

    // Fügt einen neuen Planungseintrag über das Tages-Modal hinzu.
    if (entryForm) {
        entryForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const selectedDateIso = document
                .querySelector<HTMLButtonElement>(".calendar-day--selected")
                ?.dataset.date;

            // Abbrechen, falls kein Tag ausgewählt wurde.
            if (!selectedDateIso) {
                return;
            }

            const formData = new FormData(entryForm);
            const title = String(formData.get("title") ?? "");
            const categoryId = String(formData.get("categoryId") ?? "");
            const personId = String(formData.get("personId") ?? "");

            addPlanningEntry({
                dateIso: selectedDateIso,
                title,
                categoryId,
                personId,
            });

            onRender();
        });
    }

    const personForm = document.querySelector<HTMLFormElement>("#person-form");

    // Fügt im Verwaltungs-Modal eine neue Person hinzu.
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

    const categoryForm = document.querySelector<HTMLFormElement>("#category-form");

    // Fügt im Verwaltungs-Modal eine neue Kategorie hinzu.
    if (categoryForm) {
        categoryForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(categoryForm);
            const name = String(formData.get("name") ?? "");

            addCategory({ name });
            onRender();
        });
    }

    const deleteEntryButtons = document.querySelectorAll<HTMLButtonElement>("[data-entry-id]");

    // Löscht Planungseinträge.
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

    // Löscht Personen.
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

    const deleteCategoryButtons = document.querySelectorAll<HTMLButtonElement>("[data-category-id]");

    // Löscht Kategorien.
    deleteCategoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const categoryId = button.dataset.categoryId;

            if (!categoryId) {
                return;
            }

            deleteCategory(categoryId);
            onRender();
        });
    });

    const saveButton = document.querySelector<HTMLButtonElement>("#save-button");
    const saveAsButton = document.querySelector<HTMLButtonElement>("#save-as-button");
    const loadButton = document.querySelector<HTMLButtonElement>("#load-button");

    // Speichert die aktuelle Planung.
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

    // Öffnet "Speichern unter" für die aktuelle Planung.
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

    // Lädt eine gespeicherte Planung.
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