import { readFileSync } from 'node:fs';

export class CsvFileReader {
  data: string[][] = [];

  constructor(public filePath: string) { }

  read(): void {
    this.data = readFileSync(this.filePath, {
      encoding: 'utf-8'
    })
      .split('\n')
      .map((row: string): string[] => row.split(','));
  }

};