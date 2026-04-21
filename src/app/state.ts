import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";

export const AVAILABLE_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

export let selectedYear = 2026;
export let selectedDateIso: string | null = null;
export let currentFilePath: string | null = null;

export let persons: Person[] = [
    { id: "person-anna", name: "Anna", color: "#4f46e5" },
    { id: "person-tom", name: "Tom", color: "#059669" },
];

export let planningEntries: PlanningEntry[] = [];

export function setSelectedYear(year: number): void {
    selectedYear = year;
}

export function setSelectedDateIso(dateIso: string | null): void {
    selectedDateIso = dateIso;
}

export function setCurrentFilePath(filePath: string | null): void {
    currentFilePath = filePath;
}

export function setPersons(nextPersons: Person[]): void {
    persons = nextPersons;
}

export function setPlanningEntries(nextEntries: PlanningEntry[]): void {
    planningEntries = nextEntries;
}

export function resetSelectedDate(): void {
    selectedDateIso = null;
}