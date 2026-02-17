import fs from 'fs/promises';
import path from 'path';

export interface Memory {
    id: string; // Added ID for management
    date: string;
    title: string;
    description: string;
    imageSrc: string;
}

const MEMORIES_FILE_PATH = path.join(process.cwd(), 'src/data/memories.json');

export async function getMemories(): Promise<Memory[]> {
    try {
        const data = await fs.readFile(MEMORIES_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read memories:", error);
        return [];
    }
}
