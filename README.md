# CSV Data Analysis Project

## Overview

This project focuses on reading data from a CSV file, parsing the data, analyzing it, and reporting the results. We experimented with two main approaches to structure our code: **inheritance** and **composition**. Ultimately, we chose the composition approach for its flexibility and modularity.

## Approaches

### 1. Inheritance

In our initial exploration, we implemented an abstract class called `CsvFileReader` that used inheritance to read and map data from the CSV file.

```typescript
// Importing necessary modules
import { readFileSync } from 'node:fs';

export abstract class CsvFileReader<T> {
  data: T[] = [];

  constructor(public filePath: string) {}

  abstract mapRow(row: string[]): T;

  read(): void {
    this.data = readFileSync(this.filePath, {
      encoding: 'utf-8',
    })
      .split('\n')
      .map((row: string): string[] => row.split(','))
      .map(this.mapRow);
  }
}
```

We created a `MatchReader` class that extended `CsvFileReader` and implemented the `mapRow` method to transform CSV rows into a specific data structure.

```typescript
import { CsvFileReader } from './CsvFileReader.bak';
import { dateStringToDate } from './utils';
import { MatchResult } from './utils';

// Type definition for match data
type matchData = [Date, string, string, number, number, MatchResult, string];

export class MatchReader extends CsvFileReader<matchData> {
  mapRow(row: string[]): matchData {
    return [
      dateStringToDate(row[0]),
      row[1],
      row[2],
      parseInt(row[3]),
      parseInt(row[4]),
      row[5] as MatchResult,
      row[6],
    ];
  }
}
```

### 2. Composition

In our improved approach using composition, we created separate classes that delegate responsibilities. This structure allows us to easily swap data sources without changing the core logic of our application.

#### CsvFileReader

This class reads data from the CSV file:

```typescript
import { readFileSync } from 'node:fs';

export class CsvFileReader {
  data: string[][] = [];

  constructor(public filePath: string) {}

  read(): void {
    this.data = readFileSync(this.filePath, {
      encoding: 'utf-8',
    })
      .split('\n')
      .map((row: string): string[] => row.split(','));
  }
}
```

#### MatchReader

The `MatchReader` class now uses a `DataReader` interface, which allows for different data sources:

```typescript
import { CsvFileReader } from './CsvFileReader';
import { dateStringToDate } from './utils';
import { MatchResult } from './utils';
import { matchData } from './utils';

// Interface for a data reader
export interface DataReader {
  read(): void;
  data: string[][];
}

export class MatchReader {
  static fromCsv(filePath: string): MatchReader {
    return new MatchReader(new CsvFileReader(filePath));
  }

  matches: matchData[] = [];
  constructor(public reader: DataReader) {}

  mapRow(row: string[]): matchData {
    return [
      dateStringToDate(row[0]),
      row[1],
      row[2],
      parseInt(row[3]),
      parseInt(row[4]),
      row[5] as MatchResult,
      row[6],
    ];
  }

  load(): void {
    this.reader.read();
    this.matches = this.reader.data.map(this.mapRow);
  }
}
```

### Analyzers and Reporters

We created delegated classes to analyze and report our data based on specific needs.

#### Win Analysis

This class reports the number of wins for a given team:

```typescript
import { matchData } from '../utils';
import { MatchResult } from '../utils';
import { Analyzer } from '../Summary';

export class WinAnalysis implements Analyzer {
  constructor(public team: string) {}

  run(matches: matchData[]): string {
    let wins = 0;
    for (let match of matches) {
      if (match[1] === this.team && match[5] === MatchResult.HomeWin) {
        wins++;
      } else if (match[2] === this.team && match[5] === MatchResult.AwayWin) {
        wins++;
      }
    }
    return `${this.team} won ${wins} games`;
  }
}
```

#### Output Targets

We implemented output targets to report the analyses in different formats:

**Console Report:**

```typescript
import { OutputTarget } from '../Summary';

export class ConsoleReport implements OutputTarget {
  print(report: string): void {
    console.log(report);
  }
}
```

**HTML Report:**

```typescript
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { OutputTarget } from '../Summary';

export class HtmlReport implements OutputTarget {
  print(report: string): void {
    const html = `
      <div>
        <h1>Analysis Output</h1>
        <div>${report}</div>
      </div>
    `;

    // Use process.cwd() to reference the root of your project
    const rootDir = process.cwd();
    const filePath = path.join(rootDir, 'reportOutput', 'report.html');
    writeFileSync(filePath, html);
  }
}
```

### Summary Class

The `Summary` class brings everything together by creating reports based on analysis:

```typescript
import { matchData } from './utils';
import { WinAnalysis } from './analyzers/WinAnalysis';
import { HtmlReport } from './reports/HtmlReport';
import { ConsoleReport } from './reports/ConsoleReport';

export class Summary {
  static winsAnalysisWithHtmlReport(team: string): Summary {
    return new Summary(new WinAnalysis(team), new HtmlReport());
  }

  static winsAnalysisWithConsoleReport(team: string): Summary {
    return new Summary(new WinAnalysis(team), new ConsoleReport());
  }

  constructor(public analyzer: Analyzer, public outputTarget: OutputTarget) {}

  buildAndPrintReport(matches: matchData[]): void {
    const output = this.analyzer.run(matches);
    this.outputTarget.print(output);
  }
}
```

### Helper Functions

We created some helper functions and constants, including:

- **dateStringToDate:** Converts a date string to a Date object.
- **MatchResult Enum:** Defines possible match results.
- **matchData Type:** Type definition for a match data tuple.

### Index File

Finally, our `index.ts` file ties everything together:

```typescript
import path from 'node:path';
import { MatchReader } from './modules/MatchReader';
import { Summary } from './modules/Summary';

// The file path of the CSV file
const filePath = path.join(__dirname, '..', 'football.csv');

// Create an instance of MatchReader and load the data
const matchReader = MatchReader.fromCsv(filePath);
matchReader.load();

// Create an instance of Summary and build and print the report
const manutdSummaryHtml = Summary.winsAnalysisWithHtmlReport('Man United');
const manutdSummaryConsole =
  Summary.winsAnalysisWithConsoleReport('Man United');

manutdSummaryHtml.buildAndPrintReport(matchReader.matches);
manutdSummaryConsole.buildAndPrintReport(matchReader.matches);
```

## Conclusion

This project showcases the advantages of using composition over inheritance in object-oriented design. By using composition, we can easily swap data sources and extend our application with minimal changes to the existing codebase.
