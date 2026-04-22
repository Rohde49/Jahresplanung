import type { Category } from "../models/category";
import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";

// Legt fest, ob der Planer als Jahres- oder Monatsansicht dargestellt wird.
export type PlannerViewMode = "year" | "month";

// Legt fest, welches Verwaltungs-Modal aktuell geöffnet ist.
export type ManagementModalMode = "team" | "categories" | null;

// Auswahl der Jahre, die im Planer angeboten werden.
export const AVAILABLE_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

// Aktueller Anzeigemodus des Planers.
export let plannerViewMode: PlannerViewMode = "year";

// Aktuell ausgewählter Monat für die Monatsansicht.
export let selectedMonthIndex = new Date().getMonth();

// Aktuell ausgewähltes Kalenderjahr.
export let selectedYear = 2026;

// Das aktuell ausgewählte Datum im ISO-Format, z. B. 2026-04-22.
export let selectedDateIso: string | null = null;

// Pfad der aktuell geladenen oder gespeicherten Datei.
export let currentFilePath: string | null = null;

// Steuert, ob das Tages-Modal geöffnet ist.
export let isDayModalOpen = false;

// Steuert, welches Verwaltungs-Modal geöffnet ist.
export let managementModalMode: ManagementModalMode = null;

// Liste aller Teammitglieder mit Name und Farbe.
export let persons: Person[] = [
    { id: "person-anna", name: "Anna", color: "#4f46e5" },
    { id: "person-tom", name: "Tom", color: "#059669" },
];

// Liste aller verfügbaren Kategorien.
export let categories: Category[] = [
    { id: "category-urlaub", name: "Urlaub" },
    { id: "category-teamtag", name: "Teamtag" },
    { id: "category-event", name: "Event" },
    { id: "category-sonstiges", name: "Sonstiges" },
];

// Liste aller Planungseinträge.
export let planningEntries: PlanningEntry[] = [];

// Setzt den aktuellen Planer-Anzeigemodus.
export function setPlannerViewMode(mode: PlannerViewMode): void {
    plannerViewMode = mode;
}

// Setzt den aktuell ausgewählten Monat und begrenzt ihn auf 0 bis 11.
export function setSelectedMonthIndex(monthIndex: number): void {
    selectedMonthIndex = Math.max(0, Math.min(11, monthIndex));
}

// Setzt das aktuell ausgewählte Jahr.
export function setSelectedYear(year: number): void {
    selectedYear = year;
}

// Setzt das aktuell ausgewählte Datum.
export function setSelectedDateIso(dateIso: string | null): void {
    selectedDateIso = dateIso;
}

// Setzt den aktuellen Dateipfad für Speichern und Laden.
export function setCurrentFilePath(filePath: string | null): void {
    currentFilePath = filePath;
}

// Ersetzt die komplette Personenliste.
export function setPersons(nextPersons: Person[]): void {
    persons = nextPersons;
}

// Ersetzt die komplette Kategorienliste.
export function setCategories(nextCategories: Category[]): void {
    categories = nextCategories;
}

// Ersetzt die komplette Liste der Planungseinträge.
export function setPlanningEntries(nextEntries: PlanningEntry[]): void {
    planningEntries = nextEntries;
}

// Öffnet oder schließt das Tages-Modal direkt.
export function setDayModalOpen(isOpen: boolean): void {
    isDayModalOpen = isOpen;
}

// Öffnet das Tages-Modal für ein bestimmtes Datum.
export function openDayModal(dateIso: string | null): void {
    selectedDateIso = dateIso;
    isDayModalOpen = true;
}

// Schließt das Tages-Modal.
export function closeDayModal(): void {
    isDayModalOpen = false;
}

// Öffnet das Verwaltungs-Modal für Team oder Kategorien.
export function openManagementModal(mode: Exclude<ManagementModalMode, null>): void {
    managementModalMode = mode;
}

// Schließt das Verwaltungs-Modal.
export function closeManagementModal(): void {
    managementModalMode = null;
}

// Setzt die aktuelle Datumsauswahl zurück.
export function resetSelectedDate(): void {
    selectedDateIso = null;
}