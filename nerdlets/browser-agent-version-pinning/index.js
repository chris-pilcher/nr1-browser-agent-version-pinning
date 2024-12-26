import React from "react";
import { BlockText, Card, CardBody, CardHeader, Grid, GridItem, HeadingText, Link, Tabs, TabsItem } from "nr1";
import { BrowserAgentTable, ConfirmationModal, CurrentStatus, CustomVersionForm } from "./components";
import { ModalProvider } from "./context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PINNING_DOCS_URL } from "./config";

const queryClient = new QueryClient();

export default function BrowserAgentVersionPinningNerdlet() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <ConfirmationModal />
        {/*TODO: Check if I need a grid component? Feels like I just need a stack*/}
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
                  For more information, see the{" "}
                  <Link to={PINNING_DOCS_URL}>Browser Agent Version Pinning documentation</Link>
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
                {/*TODO: should this be a container? Or something else? Basically I want to get this as short as possible */}
                <Tabs defaultValue="supported">
                  <TabsItem value="supported" label="Supported versions">
                    {/*TODO: Check what permissions are required to update pinning. See what it does if I do not have permission. */}
                    <BrowserAgentTable />
                  </TabsItem>
                  <TabsItem value="custom" label="Custom version">
                    <CustomVersionForm />
                  </TabsItem>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </ModalProvider>
    </QueryClientProvider>
  );
}
