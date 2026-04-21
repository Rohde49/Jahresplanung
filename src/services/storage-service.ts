import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { AppStorageData } from "../models/app-storage";
import type { Person } from "../models/person";
import type { PlanningEntry } from "../models/planning-entry";

function isPerson(value: unknown): value is Person {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const person = value as Record<string, unknown>;

    return (
        typeof person.id === "string" &&
        typeof person.name === "string" &&
        typeof person.color === "string"
    );
}

function isPlanningEntry(value: unknown): value is PlanningEntry {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const entry = value as Record<string, unknown>;

    return (
        typeof entry.id === "string" &&
        typeof entry.dateIso === "string" &&
        typeof entry.title === "string" &&
        typeof entry.category === "string" &&
        typeof entry.personId === "string"
    );
}

function isAppStorageData(value: unknown): value is AppStorageData {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        typeof data.selectedYear === "number" &&
        Array.isArray(data.persons) &&
        data.persons.every(isPerson) &&
        Array.isArray(data.planningEntries) &&
        data.planningEntries.every(isPlanningEntry)
    );
}

export async function chooseSaveFilePath(year: number): Promise<string | null> {
    const filePath = await save({
        defaultPath: `jahresplanung-${year}.json`,
        filters: [
            {
                name: "JSON",
                extensions: ["json"],
            },
        ],
    });

    return filePath ?? null;
}

export async function writePlanningFile(
    filePath: string,
    data: AppStorageData,
): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    await writeTextFile(filePath, json);
}

export async function chooseAndLoadPlanningFile(): Promise<{
    filePath: string;
    data: AppStorageData;
} | null> {
    const filePath = await open({
        multiple: false,
        directory: false,
        filters: [
            {
                name: "JSON",
                extensions: ["json"],
            },
        ],
    });

    if (!filePath || Array.isArray(filePath)) {
        return null;
    }

    const fileContent = await readTextFile(filePath);
    const parsedData: unknown = JSON.parse(fileContent);

    if (!isAppStorageData(parsedData)) {
        throw new Error("Die ausgewählte Datei hat kein gültiges Jahresplanungs-Format.");
    }

    return {
        filePath,
        data: parsedData,
    };
}