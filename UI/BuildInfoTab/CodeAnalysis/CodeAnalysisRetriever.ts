import { BuildRestClient } from "azure-devops-extension-api/Build";
const axios = require("axios");

export default class CodeAnalysisRetriever {
  client: BuildRestClient;
  projectId: string;
  buildId: number;

   myInit = {
    method: "HEAD",
    mode: "no-cors"
  };


  constructor(client: BuildRestClient, projectId: string, buildId: number) {
    this.client = client;
    this.projectId = projectId;
    this.buildId = buildId;
  }

  public async downloadCodeAnalysisArtifact(): Promise<string[]> {
    let analysisArtifacts: string[] = [];

    const codeAnalysisAttachement = await this.client.getAttachments(
      this.projectId,
      this.buildId,
      "pmd_analysis_results"
    );

    for (let i = 0; i < codeAnalysisAttachement.length; i++) {
      console.log(codeAnalysisAttachement[i].name);
      console.log(codeAnalysisAttachement[i]._links);

     
     

      let myRequest = new Request(codeAnalysisAttachement[i]._links, { mode: "no-cors"});

      let response: Response = await fetch(myRequest)
      let result = await response.text();
      analysisArtifacts.push(result);
    }
    return analysisArtifacts;
  }
}
