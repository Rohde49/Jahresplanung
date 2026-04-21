import type { Person } from "./person";
import type { PlanningEntry } from "./planning-entry";

export interface AppStorageData {
    selectedYear: number;
    persons: Person[];
    planningEntries: PlanningEntry[];
}