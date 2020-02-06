# SFPowerscripts

SFPowerscripts is an Azure Pipelines Extension that converts Azure Pipelines into a CI/CD platform for Salesforce. The extension features the following tasks. You can read the documenation at  [sfpowerscripts](https://www.sfpowerscripts.com) website.

Please note this extension only works with the newer source format based repositories only and  works with both Hosted Linux and Windows Agents

The changelog is available at [https://sfpowerscripts.com/changelog/](https://sfpowerscripts.com/changelog/)

## Build Result Enhancements

- PMD Apex Analysis Tab 

## Service Connection

-  Service Connection to Salesforce Org using Username/Password/Security Token which can be utilized across any of the below tasks

## Common/Utility Tasks

- Install SFDX CLI along with SFPowerkit Plugin
- Authenticate an Org using JWT or  Username/Password/Security Token
- Validate a Unlocked package for metadata coverage
- Install all package dependencies of an unlocked package
- Run apex code analysis using PMD
- Export the full metadata in an org for backup

## Deployment Related Tasks

- Checkout a source based artifact from git server (using PAT against HTTP) or Azure DevOps supported Git Providers using Service Credential
- Deploy a delta (diff between two git commit id's )
- Deploy a source format based repo to an org (scratch org/sandbox/prod)
- Deploy an unlocked package to an org
- Deploy destructive manifest to an org

## Packaging Related Tasks

- Increment Project Version Number similar to npm version patch, which can be utilized before an unlocked / source based packaging
- Create an unlocked package
- Create a build artifact for unlocked/source based packaging, which can be utilized in Release Pipelines

## Testing Related Tasks

- Trigger Apex Test
- Validate Apex Test Coverge of an org

## What is it?

- The extension is designed with tasks which are granular,  which means all the above tasks has to be orchestrated in a valid order required to reach the required objective.  This allows one to utilise other commands or extensions between the tasks and be highly effective rather than getting tied to a single task. This ensures maximum flexiblity while building the pipeline.

For eg: a Pull Request validation for an unlocked package  should feature the tasks in this order

![PR Pipeline](https://sfpowerscripts.com/images/PR%20Pipeline%20ScratchOrg.png)

 1. Install the SFDX CLI
 2. Validate the unlocked package for metadata coverage
 3. Authenticate DevHub
 4. Create a Scratch Org
 5. Install Package Dependencies in the target scratch org
 6. Deploy source to the target scratch org
 7. Delete the scratch org ( optional :  Utilize post action on create scratch org task )

* Most of the tasks are very thin wrappers aroud the equivalent sfdx cli commands or the open source sfpowerkit (SFDX CLI extension). Almost all parameters that are requred during a CI run is exposed. If you feel that is not enough for the task at hand, one can quickly fall back to command line parameterized just for the task

* Though the tasks can all be utilized fully in build pipeline. It is recommended to utilize the Release Pipeline to deploy the artifact to make the full use of Azure Pipelines Capability.

#### Getting Started

Checkout SFPowerscripts documentation here on how to [Get Started](https://sfpowerscripts.com/gettingstarted/) with these tasks. The [repo](https://github.com/azlamsalam/sfpowerscripts/tree/master/SamplePipelines) also features sample pipelines that demonstrate the usage of pipelines.

#### What if there is an issue with the extension?

Please create an issue using the methods listed [here](https://sfpowerscripts.com/support/).