import "./BuildInfoTab.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";



import { Page } from "azure-devops-ui/Page";
import { showRootComponent } from "../Common";



class BuildInfoTab extends  React.Component<{}, {}> {

    public componentDidMount() {
        SDK.init();
    }

    public render(): JSX.Element {
        return (
            <Page className="sfpowerscripts-page flex-grow">
              
                <div className="page-content">
                    <p>Feature ABC page</p>
                  
                </div>
            </Page>
        );
    }
}

showRootComponent(<BuildInfoTab />);