import type { AppStorageData } from "../models/app-storage";
import type { EntryCategory } from "../models/planning-entry";
import {
    persons,
    planningEntries,
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
}

export function selectDate(dateIso: string | null): void {
    setSelectedDateIso(dateIso);
}

export function addPlanningEntry(input: {
    dateIso: string;
    title: string;
    category: EntryCategory;
    personId: string;
}): void {
    const title = input.title.trim();

    if (!title || !input.personId) {
        return;
    }

    setPlanningEntries([
        ...planningEntries,
        {
            id: createId("entry"),
            dateIso: input.dateIso,
            title,
            category: input.category,
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

export function applyLoadedData(filePath: string, data: AppStorageData): void {
    setSelectedYear(data.selectedYear);
    setPersons(data.persons);
    setPlanningEntries(data.planningEntries);
    setSelectedDateIso(null);
    setCurrentFilePath(filePath);
}