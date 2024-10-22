import { matchData } from './utils';
import { WinAnalysis } from './analyzers/WinAnalysis';
import { HtmlReport } from './reports/HtmlReport';
import { ConsoleReport } from './reports/ConsoleReport';

export interface Analyzer {
  run(matches: matchData[]): string;
}
export interface OutputTarget {
  print(report: string): void;
}

export class Summary {
  static winsAnalysisWithHtmlReport(team: string): Summary {
    return new Summary(new WinAnalysis(team), new HtmlReport());
  }

  static winsAnalysisWithConsoleReport(team: string): Summary {
    return new Summary(new WinAnalysis(team), new ConsoleReport());
  }

  constructor(public analyzer: Analyzer, public outputTarget: OutputTarget) { }

  buildAndPrintReport(matches: matchData[]): void {
    const output = this.analyzer.run(matches);
    this.outputTarget.print(output);
  }
};