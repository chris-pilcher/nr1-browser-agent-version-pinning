import React from "react";
import { Card, CardBody, CardHeader, HeadingText, SectionMessage, Spinner, Stack, StackItem } from "nr1";
import { useConfirmationModal, usePinnedVersionQuery } from "../hooks";
import { PINNING_DOCS_URL } from "../config";

export default function PinningStatus() {
  return (
    <Card>
      <CardHeader>
        <HeadingText type={HeadingText.TYPE.HEADING_4}>Pinning status</HeadingText>
      </CardHeader>
      <CardBody>
        <Stack style={{ justifyContent: "space-between" }} fullWidth>
          <StackItem>
            <StatusMessage />
          </StackItem>
          <StackItem>
            <SectionMessage
              description="For more information please see the documentation."
              actions={[
                {
                  label: "Browser agent version pinning documentation",
                  to: PINNING_DOCS_URL,
                },
              ]}
            />
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
}

function StatusMessage() {
  const confirmationModal = useConfirmationModal();
  const pinnedVersionQuery = usePinnedVersionQuery();

  if (pinnedVersionQuery.loading) return <Spinner inline />;
  if (pinnedVersionQuery.error) {
    return (
      <SectionMessage
        type={SectionMessage.TYPE.CRITICAL}
        title="Failed to fetch pinned version"
        description="An error occurred while trying to fetch the current pinned version. Please try again later."
      />
    );
  }
  const version = pinnedVersionQuery.data;
  // TODO: When the internet is slow, this will show info before immediately showing the current version. This is a bit jarring - fix it
  return (
    <SectionMessage
      type={version ? SectionMessage.TYPE.SUCCESS : SectionMessage.TYPE.INFORMATION}
      title={version ? version : "No version pinned"}
      description={
        version
          ? `The currently pinned version is ${version}`
          : "Use the manage pinning section below if you would like to pin a version."
      }
      actions={version ? [{ label: "Remove Pinning", onClick: confirmationModal.confirmRemovePin }] : []}
    />
  );
}
