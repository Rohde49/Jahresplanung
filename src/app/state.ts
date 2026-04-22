import type { Category } from "../models/category";
import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";

export type AppView = "home" | "planner";
export type PlannerViewMode = "year" | "month";
export type ManagementModalMode = "team" | "categories" | null;

export const AVAILABLE_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

export let currentView: AppView = "home";
export let plannerViewMode: PlannerViewMode = "year";
export let selectedMonthIndex = new Date().getMonth();

export let selectedYear = 2026;
export let selectedDateIso: string | null = null;
export let currentFilePath: string | null = null;
export let isDayModalOpen = false;
export let managementModalMode: ManagementModalMode = null;

export let persons: Person[] = [
    { id: "person-anna", name: "Anna", color: "#4f46e5" },
    { id: "person-tom", name: "Tom", color: "#059669" },
];

export let categories: Category[] = [
    { id: "category-urlaub", name: "Urlaub" },
    { id: "category-teamtag", name: "Teamtag" },
    { id: "category-event", name: "Event" },
    { id: "category-sonstiges", name: "Sonstiges" },
];

export let planningEntries: PlanningEntry[] = [];

export function setCurrentView(view: AppView): void {
    currentView = view;
}

export function setPlannerViewMode(mode: PlannerViewMode): void {
    plannerViewMode = mode;
}

export function setSelectedMonthIndex(monthIndex: number): void {
    selectedMonthIndex = Math.max(0, Math.min(11, monthIndex));
}

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

export function setCategories(nextCategories: Category[]): void {
    categories = nextCategories;
}

export function setPlanningEntries(nextEntries: PlanningEntry[]): void {
    planningEntries = nextEntries;
}

export function setDayModalOpen(isOpen: boolean): void {
    isDayModalOpen = isOpen;
}

export function openDayModal(dateIso: string | null): void {
    selectedDateIso = dateIso;
    isDayModalOpen = true;
}

export function closeDayModal(): void {
    isDayModalOpen = false;
}

export function openManagementModal(mode: Exclude<ManagementModalMode, null>): void {
    managementModalMode = mode;
}

export function closeManagementModal(): void {
    managementModalMode = null;
}

export function resetSelectedDate(): void {
    selectedDateIso = null;
}