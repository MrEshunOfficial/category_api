// src/utils/regions.ts
import fs from 'fs';
import path from 'path';
import { Region } from '@/types/regions';

export function getAllRegions(): Region[] {
  try {
    // Update path to look in src/_data directory
    const dataDirectory = path.join(process.cwd(), 'src', '_data');
    
    // Check if directory exists
    if (!fs.existsSync(dataDirectory)) {
      console.error(`Directory not found: ${dataDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(dataDirectory);
    
    const regionsData: Region[] = fileNames
      .filter((fileName: string) => fileName.endsWith('.json'))
      .map((fileName: string) => {
        const filePath = path.join(dataDirectory, fileName);
        try {
          const fileContents = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(fileContents) as Region;
        } catch (error) {
          console.error(`Error reading file ${fileName}:`, error);
          return null;
        }
      })
      .filter((data): data is Region => data !== null);
    
    return regionsData;
  } catch (error) {
    console.error('Error in getAllRegions:', error);
    return [];
  }
}

export function getRegionByName(regionName: string): Region | null {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', '_data');
    const filePath = path.join(dataDirectory, `${regionName.toLowerCase()}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Region;
  } catch (error) {
    console.error(`Error in getRegionByName for ${regionName}:`, error);
    return null;
  }
}