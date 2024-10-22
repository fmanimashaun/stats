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
    const filePath = path.join(rootDir, 'reportOutput','report.html');
    writeFileSync(filePath, html);
  }
}