import child_process = require("child_process");
import { onExit } from "../Common/OnExit";

export default class TriggerApexTestImpl {
  public constructor(private target_org: string, private test_options: any) {}

  public async exec(): Promise<void> {
    let testExecCommand = this.buildTestExecCommand();

    let result = child_process.execSync(testExecCommand, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"]
    });

    let resultAsJSON = JSON.parse(result);
    let testRunId: string;
    if (resultAsJSON.status == 0) {
      testRunId = resultAsJSON.result.testRunId;
    } else throw new Error("Triggering Apex Test Run Failed");

    //First Lets print in Human for human readable
    let child = child_process.exec(
      this.buildTestReportCommand(testRunId,'human'),
      { encoding: "utf8" },
      (error, stdout, stderr) => {
        if (error) throw error;
      }
    );

    child.stdout.on("data", data => {
      console.log(data.toString());
    });

    await onExit(child);

    
    //Reprint the report in junit and make it silent
     child = child_process.exec(
      this.buildTestReportCommand(testRunId,'junit'),
      { encoding: "utf8" },
      (error, stdout, stderr) => {
        if (error) throw error;
      }
    );
    await onExit(child);

  }

  private buildTestExecCommand(): string {
    let command = `npx sfdx force:apex:test:run -u ${this.target_org}`;

    //output
    command += ` --json`;

    if(this.test_options['synchronous']==true)
    command += ` -y`;

    //testlevel
    command += ` -l ${this.test_options["testlevel"]}`;

    if (this.test_options["testlevel"] == "RunSpecifiedTests") {
      command += ` -t ${this.test_options["specified_tests"]}`;
    } else if (this.test_options["testlevel"] == "RunApexTestSuite") {
      command += ` -s ${this.test_options["apextestsuite"]}`;
    }
    console.log(`Generated Command: ${command}`)
    return command;
  }

  private buildTestReportCommand(testRunId: string, format:string): string {
    let command = `npx sfdx force:apex:test:report -u ${this.target_org}`;

    command += ` -r ${format}`;

    command += ` -c`;

    //testid
    command += ` -i ${testRunId}`;

    //wait time
    command += ` -w  ${this.test_options["wait_time"]}`;

    //store result
    command += ` -d  ${this.test_options["outputdir"]}`;

    console.log(`Generated Command: ${command}`)
    return command;
  }

  
}
