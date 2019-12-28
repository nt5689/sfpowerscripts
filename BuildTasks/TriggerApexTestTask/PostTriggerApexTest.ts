import tl = require("azure-pipelines-task-lib/task");
import path = require("path");
import fs = require("fs-extra");


async function run() {

  let stagingDir: string = path.join(
    tl.getVariable("build.artifactStagingDirectory"),
    ".testresults"
  );
  publishTestResults(stagingDir);
 
}

function publishTestResults(resultsDir: string): void {
  const buildConfig = tl.getVariable('BuildConfiguration');
  const buildPlaform = tl.getVariable('BuildPlatform');
  const testRunTitle = "Apex Test Run";
  const matchingTestResultsFiles: string[] = tl.findMatch(resultsDir, '*-junit.xml');
  if (matchingTestResultsFiles && matchingTestResultsFiles.length > 0) {
      const tp: tl.TestPublisher = new tl.TestPublisher('JUnit');
      tp.publish(matchingTestResultsFiles, 'true', buildPlaform, buildConfig, testRunTitle, 'true', "sfpowerscripts-apextests");
      //Remove the directory, so that other post execution scripts dont upload the same test results again and duplicate
      fs.removeSync(resultsDir);
  }
}

run();
