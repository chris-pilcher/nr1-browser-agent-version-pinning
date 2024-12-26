import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HeadingText,
  InlineMessage,
  SectionMessage,
  Spinner,
  Stack,
  StackItem,
} from "nr1";
import { useConfirmationModal, usePinnedVersionQuery } from "../hooks";
import { PINNING_DOCS_URL } from "../config";

export default function PinningStatus() {
  const { data, isLoading, error } = usePinnedVersionQuery();
  const confirmationModal = useConfirmationModal();

  return (
    <Card>
      <CardHeader>
        <HeadingText type={HeadingText.TYPE.HEADING_4}>Pinning status</HeadingText>
      </CardHeader>
      <CardBody>
        <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL} gapType={Stack.GAP_TYPE.LARGE}>
          <StackItem>
            <StatusMessage loading={isLoading} error={error} version={data} />
          </StackItem>
          <StackItem>
            <Button disabled={!data} onClick={confirmationModal.confirmRemovePin}>
              Remove Pinning
            </Button>
          </StackItem>
          <StackItem>
            <SectionMessage
              description="For more information on browser agent version pinning, see the documentation."
              actions={[{ label: "Browser agent version pinning documentation", to: PINNING_DOCS_URL }]}
            />
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
}

function StatusMessage({ loading, error, version }) {
  if (loading) return <Spinner inline />;
  if (error) {
    return (
      <InlineMessage
        type={InlineMessage.TYPE.CRITICAL}
        label="Failed to fetch pinned version"
        description="An error occurred while trying to fetch the current pinned version. Please try again later."
      />
    );
  }
  return (
    <InlineMessage
      type={version ? InlineMessage.TYPE.SUCCESS : InlineMessage.TYPE.NORMAL}
      label={version ? `Pinned version: ${version}` : "No version pinned"}
    />
  );
}
