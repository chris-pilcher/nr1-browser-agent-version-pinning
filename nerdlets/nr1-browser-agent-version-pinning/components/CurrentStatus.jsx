import React from "react";
import { Button, Card, CardBody, CardHeader, CardSection, HeadingText, InlineMessage, Spinner } from "nr1";
import { useModal, usePinnedVersionQuery } from "../hooks";

export default function CurrentStatus() {
  const { data, isLoading, error } = usePinnedVersionQuery();
  const { openModal } = useModal();

  return (
    <Card>
      <CardHeader>
        <HeadingText type={HeadingText.TYPE.HEADING_4}>Current pinning status</HeadingText>
      </CardHeader>
      <CardBody>
        <CardSection>
          <StatusMessage loading={isLoading} error={error} version={data} />
        </CardSection>
        <CardSection>
          {/*TODO: It's a modal ... but it's very specific to updating the version ... lets consider the name*/}
          <Button disabled={!data} onClick={() => openModal(null)}>
            Remove Pinning
          </Button>
        </CardSection>
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
