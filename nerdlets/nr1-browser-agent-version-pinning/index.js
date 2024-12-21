import React from "react";
import {
  BlockText,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSection,
  Grid,
  GridItem,
  HeadingText,
  Link,
  Tabs,
  TabsItem,
  Spinner,
} from "nr1";
import { BrowserAgentTable, CurrentStatus, CustomVersionForm } from "./components";
import { PinnedVersionProvider } from "./context";

function Nr1BrowserAgentVersionPinningNerdlet() {
  return (
    <PinnedVersionProvider>
      <Grid>
        <GridItem columnSpan={12}>
          <Card>
            <CardHeader>
              <HeadingText type={HeadingText.TYPE.HEADING_4}>Version pinning</HeadingText>
            </CardHeader>
            <CardBody>
              <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}>
                Pin a specific version of the New Relic Browser agent to ensure platform consistency.
              </BlockText>
              <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}>
                This extension for New Relic One simplifies browser agent version pinning, eliminating the need to use
                the NerdGraph API directly.
              </BlockText>
              <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}>
                For more information, see the {/*TODO: Consts file for links*/}
                <Link to="https://docs.newrelic.com/docs/apis/nerdgraph/examples/browser-monitoring-config-nerdgraph/#browser-agent-version-pinning">
                  Browser Agent Version Pinning documentation
                </Link>
              </BlockText>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem columnSpan={12}>
          <CurrentStatus />
        </GridItem>
        <GridItem columnSpan={12}>
          <Card>
            <CardHeader>
              <HeadingText
                type={HeadingText.TYPE.HEADING_4}
                spacingType={[HeadingText.SPACING_TYPE.MEDIUM, HeadingText.SPACING_TYPE.NONE]}>
                Manage pinning
              </HeadingText>
            </CardHeader>
            <CardBody>
              <Tabs defaultValue="supported">
                <TabsItem value="supported" label="Supported versions">
                  <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
                    The versions in the table below are the{" "}
                    <Link to="https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/browser-agent-eol-policy/">
                      currently supported versions of the New Relic browser agent
                    </Link>
                  </BlockText>
                  {/*TODO: What happens when I do not have permission to update pinning?*/}
                  <BrowserAgentTable />
                </TabsItem>
                <TabsItem value="custom" label="Custom version">
                  {/*<CustomVersionForm*/}
                  {/*    currentPinnedVersion={pinnedVersion}*/}
                  {/*    // onUpdateVersion={handleUpdateVersion}*/}
                  {/*/>*/}
                </TabsItem>
              </Tabs>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PinnedVersionProvider>
  );
}

export default Nr1BrowserAgentVersionPinningNerdlet;
