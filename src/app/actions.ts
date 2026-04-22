import type { AppStorageData } from "../models/app-storage";
import {
    categories,
    closeDayModal,
    closeManagementModal,
    openDayModal,
    openManagementModal,
    persons,
    planningEntries,
    setCategories,
    setCurrentFilePath,
    setPersons,
    setPlanningEntries,
    setSelectedDateIso,
    setSelectedYear,
} from "./state";

// Erzeugt eine einfache eindeutige ID für neue Einträge, Personen oder Kategorien.
function createId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Ändert das ausgewählte Jahr und setzt die Tagesauswahl zurück.
export function changeSelectedYear(year: number): void {
    setSelectedYear(year);
    setSelectedDateIso(null);
    closeDayModal();
}

// Öffnet das Tages-Modal für das ausgewählte Datum.
export function selectDate(dateIso: string | null): void {
    openDayModal(dateIso);
}

// Schließt das Tages-Modal.
export function closeSelectedDayModal(): void {
    closeDayModal();
}

// Öffnet das Verwaltungs-Modal für Teammitglieder.
export function openTeamManagementModal(): void {
    openManagementModal("team");
}

// Öffnet das Verwaltungs-Modal für Kategorien.
export function openCategoryManagementModal(): void {
    openManagementModal("categories");
}

// Schließt das Verwaltungs-Modal.
export function closeSelectedManagementModal(): void {
    closeManagementModal();
}

// Fügt einen neuen Planungseintrag hinzu, wenn alle Pflichtdaten vorhanden sind.
export function addPlanningEntry(input: {
    dateIso: string;
    title: string;
    categoryId: string;
    personId: string;
}): void {
    const title = input.title.trim();

    // Abbrechen, wenn Titel, Person oder Kategorie fehlen.
    if (!title || !input.personId || !input.categoryId) {
        return;
    }

    setPlanningEntries([
        ...planningEntries,
        {
            id: createId("entry"),
            dateIso: input.dateIso,
            title,
            categoryId: input.categoryId,
            personId: input.personId,
        },
    ]);
}

// Löscht einen Planungseintrag anhand seiner ID.
export function deletePlanningEntry(entryId: string): void {
    setPlanningEntries(planningEntries.filter((entry) => entry.id !== entryId));
}

// Fügt eine neue Person hinzu, wenn ein Name vorhanden ist.
export function addPerson(input: { name: string; color: string }): void {
    const name = input.name.trim();

    // Abbrechen, wenn kein Name eingegeben wurde.
    if (!name) {
        return;
    }

    setPersons([
        ...persons,
        {
            id: createId("person"),
            name,
            color: input.color,
        },
    ]);
}

// Löscht eine Person und entfernt gleichzeitig alle dazugehörigen Planungseinträge.
export function deletePerson(personId: string): void {
    setPersons(persons.filter((person) => person.id !== personId));
    setPlanningEntries(planningEntries.filter((entry) => entry.personId !== personId));
}

// Fügt eine neue Kategorie hinzu, wenn ein Name vorhanden ist.
export function addCategory(input: { name: string }): void {
    const name = input.name.trim();

    // Abbrechen, wenn kein Name eingegeben wurde.
    if (!name) {
        return;
    }

    setCategories([
        ...categories,
        {
            id: createId("category"),
            name,
        },
    ]);
}

// Löscht eine Kategorie und entfernt gleichzeitig alle Einträge mit dieser Kategorie.
export function deleteCategory(categoryId: string): void {
    setCategories(categories.filter((category) => category.id !== categoryId));
    setPlanningEntries(planningEntries.filter((entry) => entry.categoryId !== categoryId));
}

// Übernimmt geladene Daten vollständig in den aktuellen App-Zustand.
export function applyLoadedData(filePath: string, data: AppStorageData): void {
    setSelectedYear(data.selectedYear);
    setPersons(data.persons);
    setCategories(data.categories);
    setPlanningEntries(data.planningEntries);
    setSelectedDateIso(null);
    closeDayModal();
    closeManagementModal();
    setCurrentFilePath(filePath);
}