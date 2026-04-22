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

function createId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function changeSelectedYear(year: number): void {
    setSelectedYear(year);
    setSelectedDateIso(null);
    closeDayModal();
}

export function selectDate(dateIso: string | null): void {
    openDayModal(dateIso);
}

export function closeSelectedDayModal(): void {
    closeDayModal();
}

export function openTeamManagementModal(): void {
    openManagementModal("team");
}

export function openCategoryManagementModal(): void {
    openManagementModal("categories");
}

export function closeSelectedManagementModal(): void {
    closeManagementModal();
}

export function addPlanningEntry(input: {
    dateIso: string;
    title: string;
    categoryId: string;
    personId: string;
}): void {
    const title = input.title.trim();

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

export function deletePlanningEntry(entryId: string): void {
    setPlanningEntries(planningEntries.filter((entry) => entry.id !== entryId));
}

export function addPerson(input: { name: string; color: string }): void {
    const name = input.name.trim();

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

export function deletePerson(personId: string): void {
    setPersons(persons.filter((person) => person.id !== personId));
    setPlanningEntries(planningEntries.filter((entry) => entry.personId !== personId));
}

export function addCategory(input: { name: string }): void {
    const name = input.name.trim();

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

export function deleteCategory(categoryId: string): void {
    setCategories(categories.filter((category) => category.id !== categoryId));
    setPlanningEntries(planningEntries.filter((entry) => entry.categoryId !== categoryId));
}

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