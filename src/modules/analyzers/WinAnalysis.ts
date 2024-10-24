import { matchData } from '../utils';
import { MatchResult } from '../utils';
import { Analyzer } from '../Summary';

export class WinAnalysis implements Analyzer{
  constructor(public team: string) { }

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