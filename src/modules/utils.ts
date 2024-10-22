/* 
@param dateString: string - a date string in the format 'dd/mm/yyyy'
# @returns: Date - a Date object representing the date passed in
*/

export const dateStringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/')

  return new Date(`${year}-${month}-${day}`);
};

// enum for possible match results
export enum MatchResult {
  HomeWin = 'H',
  AwayWin = 'A',
  Draw = 'D'
};

// type definition for a match data tuple
export type matchData = [Date, string, string, number, number, MatchResult, string];