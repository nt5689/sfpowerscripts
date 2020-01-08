import { BuildRestClient } from "azure-devops-extension-api/Build";
const axios = require("axios");

export default class CodeAnalysisRetriever {
  client: BuildRestClient;
  projectId: string;
  buildId: number;

  constructor(client: BuildRestClient, projectId: string, buildId: number) {
    this.client = client;
    this.projectId = projectId;
    this.buildId = buildId;
  }

  public async downloadCodeAnalysisArtifact():Promise<string> {
    const codeAnalysisArtifact = await this.client.getArtifact(
      this.projectId,
      this.buildId,
      "Code Analysis Results"
    );
    const response = await axios.get(codeAnalysisArtifact.resource.downloadUrl);

    // var zip = new admzip(response.data);
    // var zipEntries = zip.getEntries();
    // console.log(zipEntries.length);

    // zipEntries.forEach(entry => {
    //   console.log(entry.toString());
    // });
    return "";
  }
}
