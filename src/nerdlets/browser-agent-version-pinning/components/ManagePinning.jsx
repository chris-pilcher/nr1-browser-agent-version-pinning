import React from "react";
import { Card, CardBody, CardHeader, HeadingText, Tabs, TabsItem } from "nr1";
import { BrowserAgentTable, CustomVersionForm } from "./index";

export default function ManagePinning() {
  return (
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
            <BrowserAgentTable />
          </TabsItem>
          <TabsItem value="custom" label="Custom version">
            <CustomVersionForm />
          </TabsItem>
        </Tabs>
      </CardBody>
    </Card>
  );
}
