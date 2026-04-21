export const ENTRY_CATEGORIES = [
    "Urlaub",
    "Teamtag",
    "Event",
    "Sonstiges",
] as const;

export type EntryCategory = (typeof ENTRY_CATEGORIES)[number];

export interface PlanningEntry {
    id: string;
    dateIso: string;
    title: string;
    category: EntryCategory;
    personId: string;
}