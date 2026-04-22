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

// Funktionspaket, das von außen an die Event-Handler übergeben wird.
interface AttachEventHandlersOptions {
    onRender: () => void;
    onSave: () => Promise<void>;
    onSaveAs: () => Promise<void>;
    onLoad: () => Promise<void>;
    onPrintCurrentMonth: () => Promise<void>;
}

// Verknüpft alle UI-Elemente mit ihrer jeweiligen Logik.
export function attachEventHandlers({
                                        onRender,
                                        onSave,
                                        onSaveAs,
                                        onLoad,
                                        onPrintCurrentMonth,
                                    }: AttachEventHandlersOptions): void {
    const openTeamModalButton = document.querySelector<HTMLButtonElement>("#open-team-modal-button");
    const openCategoriesModalButton = document.querySelector<HTMLButtonElement>("#open-categories-modal-button");
    const printCurrentMonthButton = document.querySelector<HTMLButtonElement>("#print-current-month-button");

    if (openTeamModalButton) {
        openTeamModalButton.addEventListener("click", () => {
            openTeamManagementModal();
            onRender();
        });
    }

    if (openCategoriesModalButton) {
        openCategoriesModalButton.addEventListener("click", () => {
            openCategoryManagementModal();
            onRender();
        });
    }

    if (printCurrentMonthButton) {
        printCurrentMonthButton.addEventListener("click", async () => {
            try {
                await onPrintCurrentMonth();
            } catch (error) {
                console.error("Fehler beim Drucken:", error);
                alert(`Die Druckansicht konnte nicht geöffnet werden: ${String(error)}`);
            }
        });
    }

    const yearSelect = document.querySelector<HTMLSelectElement>("#year-select");

    if (yearSelect) {
        yearSelect.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            changeSelectedYear(Number(target.value));
            onRender();
        });
    }

    const plannerViewModeSelect =
        document.querySelector<HTMLSelectElement>("#planner-view-mode");

    if (plannerViewModeSelect) {
        plannerViewModeSelect.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            setPlannerViewMode(target.value as "year" | "month");
            onRender();
        });
    }

    const monthSelect = document.querySelector<HTMLSelectElement>("#month-select");

    if (monthSelect) {
        monthSelect.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            setSelectedMonthIndex(Number(target.value));
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

    const closeDayModalButton =
        document.querySelector<HTMLButtonElement>("#close-day-modal-button");
    const dayModalOverlay = document.querySelector<HTMLDivElement>("#day-modal-overlay");

    if (closeDayModalButton) {
        closeDayModalButton.addEventListener("click", () => {
            closeSelectedDayModal();
            onRender();
        });
    }

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

    if (closeManagementModalButton) {
        closeManagementModalButton.addEventListener("click", () => {
            closeSelectedManagementModal();
            onRender();
        });
    }

    if (managementModalOverlay) {
        managementModalOverlay.addEventListener("click", (event) => {
            if (event.target === managementModalOverlay) {
                closeSelectedManagementModal();
                onRender();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSelectedDayModal();
            closeSelectedManagementModal();
            onRender();
        }
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

    const deleteCategoryButtons = document.querySelectorAll<HTMLButtonElement>("[data-category-id]");

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