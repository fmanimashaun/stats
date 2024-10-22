import path from 'node:path';
import { MatchReader } from './modules/MatchReader';
import { Summary } from './modules/Summary';

// the file path of the csv file
const filePath = path.join(__dirname, '..', 'football.csv');

// create an instance of MatchReader and load the data
const matchReader = MatchReader.fromCsv(filePath);
matchReader.load();

// create an instance of Summary and build and print the report
const manutdSummaryHtml = Summary.winsAnalysisWithHtmlReport("Man United")
const manutdSummaryConsole = Summary.winsAnalysisWithConsoleReport("Man United");
manutdSummaryHtml.buildAndPrintReport(matchReader.matches);
manutdSummaryConsole.buildAndPrintReport(matchReader.matches);