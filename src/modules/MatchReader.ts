import { CsvFileReader } from './CsvFileReader';
import { dateStringToDate } from './utils';
import { MatchResult } from './utils';
import { matchData } from './utils';

// interface for a data reader
export interface DataReader {
  read(): void;
  data: string[][];
}

export class MatchReader {
  static fromCsv(filePath: string): MatchReader {
    return new MatchReader(new CsvFileReader(filePath));
  }
  
  matches: matchData[] = [];
  constructor(public reader: DataReader) { }
  mapRow(row: string[]): matchData {
    return [
      dateStringToDate(row[0]),
      row[1],
      row[2],
      parseInt(row[3]),
      parseInt(row[4]),
      row[5] as MatchResult,
      row[6]
    ];
  }

  load(): void {
    this.reader.read();
    this.matches = this.reader.data.map(this.mapRow);
  }
}