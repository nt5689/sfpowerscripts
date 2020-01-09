import xml2js = require("xml2js");

export interface CodeAnalysisResult {
  name:string;
  violationCount: number;
  affectedFileCount: number;
  criticaldefects: number;
}

export default class CodeAnalysisArtifactProcessor {
  reportContents: string;

  constructor(reportContents) {
    this.reportContents = reportContents;
  }

  public async processCodeQualityFromArtifact(): Promise<
    CodeAnalysisResult 
  > {
    let name = 'sf-pmd-xml';
    let affectedFileCount = 0;
    let violationCount = 0;
    let criticaldefects = 0;

    xml2js.parseString(this.reportContents, (err, data) => {
      // If the file is not XML, or is not from PMD, return immediately
      if (!data || !data.pmd) {
        console.debug(`Empty or unrecognized PMD xml report`);
        return undefined;
      }

      if (!data.pmd.file || data.pmd.file.length === 0) {
        // No files with violations, return now that it has been marked for upload
        return undefined;
      }

      data.pmd.file.forEach((file: any) => {
        if (file.violation) {
          affectedFileCount++;
          violationCount += file.violation.length;
        }
      });

      data.pmd.file[0].violation.forEach(
        (element: { [x: string]: { [x: string]: number } }) => {
          if (element["$"]["priority"] == 5) {
            criticaldefects++;
          }
        }
      );
    });

    return { name, violationCount, affectedFileCount, criticaldefects };
  }
}
