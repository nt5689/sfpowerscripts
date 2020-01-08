import "./BuildInfoTab.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { Page } from "azure-devops-ui/Page";
import { showRootComponent } from "../Common";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import { Button } from "azure-devops-ui/Button";
import { getClient } from 'azure-devops-extension-api';
import { BuildRestClient, Build, BuildStatus, IBuildPageDataService, BuildServiceIds, BuildArtifact } from "azure-devops-extension-api/Build";
import CodeAnalysisRetriever from "./CodeAnalysis/CodeAnalysisRetriever";
import CodeAnalysisArtifactProcessor from "./CodeAnalysis/CodeAnalysisArtifactProcessor";






class BuildInfoTab extends React.Component<{}, {}> {
  accessToken = "0";
  

  public async componentDidMount() {
    this.initializeState();
  }

  private async initializeState(): Promise<void> {
    SDK.init();
    await SDK.ready();

 
    this.accessToken = await SDK.getAccessToken();

    const config = SDK.getConfiguration();
    console.log('Hello');
  

    const buildInfo = await SDK.getService<IBuildPageDataService>(BuildServiceIds.BuildPageDataService);
    const buildPageData = await buildInfo.getBuildPageData();
    console.log(buildPageData);

    console.log("Find Build Number");

  
    console.log('Build Number:'+buildPageData!.build!.buildNumber);
    console.log('Build Id:'+buildPageData!.build!.id);
    console.log('Project Id: '+buildPageData!.definition!.project.id);
    const client = getClient(BuildRestClient);
    
    let codeAnalysisRetriever:CodeAnalysisRetriever = new CodeAnalysisRetriever(client,buildPageData!.definition!.project.id,buildPageData!.build!.id);
    var codeAnalysisReport:string = await codeAnalysisRetriever.downloadCodeAnalysisArtifact();
      
    let codeAnalysisProcessor:CodeAnalysisArtifactProcessor = new CodeAnalysisArtifactProcessor(codeAnalysisReport);
    await codeAnalysisProcessor.processCodeQualityFromArtifact();


   //Get Code Analysis Artifact
  // Code Analysis Results

     
    
    this.setState({ });
  }

  public render(): JSX.Element {
    return (
      <Page className="sfpowerscripts-page flex-grow">
        <div className="page-content">
          <h1>{this.accessToken}</h1>
          <ButtonGroup className="sample-panel-button-bar">
            <Button
              primary={true}
              text="OK"
              onClick={() => this.dismiss(true)}
            />
            <Button text="Cancel" onClick={() => this.dismiss(false)} />
          </ButtonGroup>
        </div>
      </Page>
    );
  }

  private dismiss(useValue: boolean) {
    this.accessToken = '3';
    this.setState({});
  }
}

showRootComponent(<BuildInfoTab />);
