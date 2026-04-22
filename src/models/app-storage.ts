import type { Category } from "./category";
import type { Person } from "./person";
import type { PlanningEntry } from "./planning-entry";

export interface AppStorageData {
    selectedYear: number;
    persons: Person[];
    categories: Category[];
    planningEntries: PlanningEntry[];
}