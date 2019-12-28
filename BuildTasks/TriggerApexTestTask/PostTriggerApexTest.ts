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

  //Check if any files exist in the staging directory
  const matchingTestResultsFiles: string[] = tl.findMatch(
    resultsDir,
    "*-junit.xml"
  );

  if (matchingTestResultsFiles && matchingTestResultsFiles.length > 0) {
    //Create a arritfact directory which copies the whole results
    //Workaround for publish command for not being async and to prevent duplicate addition when this post command is executed multiple times
    let artifactDirectory: string = path.join(
      tl.getVariable("build.artifactStagingDirectory"),
      "testartifact"
    );
    fs.copySync(resultsDir, artifactDirectory);

    const junitResultFiles: string[] = tl.findMatch(
      artifactDirectory,
      "*-junit.xml"
    );

    const buildConfig = tl.getVariable("BuildConfiguration");
    const buildPlaform = tl.getVariable("BuildPlatform");
    const testRunTitle = "Apex Test Run";

    const tp: tl.TestPublisher = new tl.TestPublisher("JUnit");
    tp.publish(
      junitResultFiles,
      "true",
      buildPlaform,
      buildConfig,
      testRunTitle,
      "true",
      "sfpowerscripts-apextests"
    );
    //Remove the directory, so that other post execution scripts dont upload the same test results again and duplicate
    fs.removeSync(resultsDir);
  }
}

run();
