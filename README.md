# TypeScript Concepts Demonstration Project - stats

## Overview

This project serves as a demonstration of various TypeScript concepts, including **enums**, **generics**, **inheritance versus composition**, and best practices for their usage. It highlights how these concepts can be effectively applied to create flexible and reusable code.

## Key Concepts Explored

### 1. Enums

Enums in TypeScript provide a way to define a set of named constants. In this project, we utilize an enum to represent possible match results, enhancing code readability and maintainability.

```typescript
// Enum for possible match results
export enum MatchResult {
  HomeWin = 'H',
  AwayWin = 'A',
  Draw = 'D'
};
```

### 2. Generics

Generics allow us to define functions and classes with placeholder types. This project demonstrates how generics can be used to create flexible data structures and methods that can work with various data types.

```typescript
// Abstract class utilizing generics
export abstract class CsvFileReader<T> {
  data: T[] = [];

  constructor(public filePath: string) { }

  abstract mapRow(row: string[]): T;

  read(): void {
    this.data = readFileSync(this.filePath, {
      encoding: 'utf-8'
    })
      .split('\n')
      .map((row: string): string[] => row.split(',')).map(this.mapRow);
  }
}
```

### 3. Inheritance vs. Composition

The project explores two design patterns: inheritance and composition. 

#### Inheritance Approach

Initially, we utilized inheritance to create a class hierarchy for reading and mapping data. This approach demonstrated a clear structure but introduced limitations in terms of flexibility and reusability.

```typescript
// MatchReader extending CsvFileReader
export class MatchReader extends CsvFileReader<matchData> {
  mapRow(row: string[]): matchData {
    // Implementation...
  }
}
```

#### Composition Approach

We then transitioned to a composition-based design, where functionality is built using smaller, reusable classes. This approach enhances flexibility, allowing easy integration of new features or data sources without modifying existing code.

```typescript
// CsvFileReader class for reading data
export class CsvFileReader {
  data: string[][] = [];

  constructor(public filePath: string) { }

  read(): void {
    // Implementation...
  }
}

// MatchReader class using composition
export class MatchReader {
  constructor(public reader: DataReader) { }
  // Implementation...
}
```

### 4. Practical Applications

The project includes practical implementations of analysis and reporting through dedicated classes, which can be easily extended or modified based on specific requirements.

#### Win Analysis Example

```typescript
export class WinAnalysis implements Analyzer {
  constructor(public team: string) { }

  run(matches: matchData[]): string {
    // Implementation...
  }
}
```

#### Reporting Mechanisms

The results can be outputted to the console or formatted as HTML, demonstrating how different reporting strategies can be implemented through the use of interfaces.

```typescript
export class ConsoleReport implements OutputTarget {
  print(report: string): void {
    console.log(report);
  }
}

export class HtmlReport implements OutputTarget {
  print(report: string): void {
    // Implementation...
  }
}
```

## Getting Started

To run this project, ensure you have Node.js installed. Clone the repository and run the following commands:

```bash
npm install
npm start
```

## Conclusion

This project illustrates the importance of understanding and utilizing TypeScript features such as enums, generics, and the trade-offs between inheritance and composition. By applying these concepts, developers can create robust, maintainable, and reusable code.

