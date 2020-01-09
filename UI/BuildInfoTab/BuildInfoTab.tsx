import "./BuildInfoTab.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import {
  ObservableArray,
  ObservableValue
} from "azure-devops-ui/Core/Observable";
import {
  renderSimpleCell,
  Table,
  TableColumnLayout,
  ColumnFill,
  ISimpleTableCell
} from "azure-devops-ui/Table";

import { Page } from "azure-devops-ui/Page";
import { showRootComponent } from "../Common";
import { getClient } from "azure-devops-extension-api";
import {
  BuildRestClient,
  IBuildPageDataService,
  BuildServiceIds,
  BuildArtifact
} from "azure-devops-extension-api/Build";
import CodeAnalysisRetriever from "./CodeAnalysis/CodeAnalysisRetriever";
import CodeAnalysisArtifactProcessor, {
  CodeAnalysisResult
} from "./CodeAnalysis/CodeAnalysisArtifactProcessor";
import Loader from "react-loader-spinner";

import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Card } from "azure-devops-ui/Card";
import { Button } from "azure-devops-ui/Button";
import { ISimpleListCell } from "azure-devops-ui/Components/List/List.Props";

interface IBuildInfoTabState {
  isDataLoaded: boolean;
}

export interface ITableItem extends ISimpleTableCell {
  name: ISimpleListCell;
  criticaldefects: number;
  violationCount: number;
  affectedFileCount: number;
}

class BuildInfoTab extends React.Component<{}, IBuildInfoTabState> {
  private itemProvider = new ObservableArray<
    ITableItem | ObservableValue<ITableItem | undefined>
  >();
  private asyncColumns = [
    {
      columnLayout: TableColumnLayout.none,
      id: "name",
      name: "Name",
      readonly: true,
      renderCell: renderSimpleCell,
      width: 200
    },
    {
      columnLayout: TableColumnLayout.none,
      id: "criticaldefects",
      name: "Critical Defects",
      readonly: true,
      renderCell: renderSimpleCell,
      width: 200
    },
    {
      id: "violationCount",
      name: "Violation Count",
      readonly: true,
      renderCell: renderSimpleCell,
      width: 200
    },
    {
      columnLayout: TableColumnLayout.none,
      id: "affectedFileCount",
      name: "Affected Files",
      readonly: true,
      renderCell: renderSimpleCell,
      width: 200
    },

    ColumnFill
  ];

  accessToken = "0";
  results: CodeAnalysisResult[] | undefined = [];

  constructor(props: {}) {
    super(props);

    this.state = {
      isDataLoaded: false
    };
  }

  public async componentDidMount() {
    this.initializeState();
  }

  private async initializeState(): Promise<void> {
    SDK.init();
    await SDK.ready();

    
 
    this.setState({ isDataLoaded: false });

    const buildInfo = await SDK.getService<IBuildPageDataService>(
      BuildServiceIds.BuildPageDataService
    );
    const buildPageData = await buildInfo.getBuildPageData();
    console.log(buildPageData);

    console.log("Find Build Number");

    console.log("Build Number:" + buildPageData!.build!.buildNumber);
    console.log("Build Id:" + buildPageData!.build!.id);
    console.log("Project Id: " + buildPageData!.definition!.project.id);
    const client = getClient(BuildRestClient);

    this.setState({ isDataLoaded: true });

    let codeAnalysisRetriever: CodeAnalysisRetriever = new CodeAnalysisRetriever(
      client,
      buildPageData!.definition!.project.id,
      buildPageData!.build!.id
    );

    var codeAnalysisReport: string[] = await codeAnalysisRetriever.downloadCodeAnalysisArtifact();

    let codeAnalysisProcessor: CodeAnalysisArtifactProcessor = new CodeAnalysisArtifactProcessor(
      codeAnalysisReport
    );

    for (let index = 0; index < codeAnalysisReport.length; index++) {

      let result = await codeAnalysisProcessor.processCodeQualityFromArtifact();
      let asyncRow = new ObservableValue<ITableItem | undefined>(undefined);
      asyncRow.value = {
        criticaldefects: result.criticaldefects,
        violationCount: result.violationCount,
        affectedFileCount: result.affectedFileCount,
        name: {
          text: "sfpowerkit_pmd_analysis"
        }
      };
      this.itemProvider.push(asyncRow);
    }

    //Get Code Analysis Artifact
    // Code Analysis Results
    this.setState({ isDataLoaded: true });
  }

  public render(): JSX.Element {
    const isLoaderToBeHidden = this.state.isDataLoaded;

    return (
      <Page className="sfpowerscripts-page flex-grow">
        <div className="page-content">
          {isLoaderToBeHidden ? (
            <div className="flex-column">
              <Card
                className="flex-grow bolt-table-card"
                contentProps={{ contentPadding: false }}
              >
                <Table<{}>
                  columns={this.asyncColumns}
                  itemProvider={this.itemProvider}
                  role="table"
                />
              </Card>
            </div>
          ) : (
            <Loader className="centered" type="Oval" color="#00BFFF" />
          )}
        </div>
      </Page>
    );
  }
}

showRootComponent(<BuildInfoTab />);
