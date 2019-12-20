import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
import { AppInsights } from "../Common/AppInsights";
import fs = require("fs-extra");
import { isNullOrUndefined } from "util";
import path = require("path");


async function run() {
  try {
    AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled", true));
    console.log("SFPowerScript.. Install SFDX/SFPowerkit");

    const cli_version: string = tl.getInput("sfdx_cli_version", false);
    const sfpowerkit_version: string = tl.getInput("sfpowerkit_version", false);
    const sfdx_plugins:string = tl.getInput("plugins",false);
    
    let plugins:string[]=[];
    let sfdx_homedirectory;
    let whitelistpath="";


    if(!isNullOrUndefined(sfdx_plugins))
    plugins=sfdx_plugins.split(',');

    plugins.push(`sfpowerkit@${sfpowerkit_version}`);


    if (tl.getVariable("Agent.OS") == "Windows_NT") {
      child_process.execSync(`npm install -g sfdx-cli@${cli_version}`);
      sfdx_homedirectory=process.env.APPDATA;
      whitelistpath = path.join(sfdx_homedirectory, "sfdx");
    } else {
      child_process.execSync(`sudo yarn global add sfdx-cli@${cli_version}`);
      sfdx_homedirectory=require('os').homedir();
      whitelistpath = path.join(sfdx_homedirectory, ".config","sfdx");
    }
   
    console.log("SFDX CLI Installed");
    tl.debug(`HomeDirectory: ${sfdx_homedirectory}`);
    tl.debug(`WhiteListPath: ${whitelistpath} ${plugins}`);
   
    fs.writeJSONSync(whitelistpath,plugins);


    plugins.forEach(element => {
      console.log(`Installing Plugin ${element}`)
      child_process.execSync(
        `sfdx plugins:install ${element}`
      );

    });
   


   

    AppInsights.trackTask("sfpwowerscript-installsfdx-task");
    AppInsights.trackTaskEvent("sfpwowerscript-installsfdx-task");
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
    AppInsights.trackExcepiton("Install SFDX with sfpowerkit", err);
  }
}

run();
