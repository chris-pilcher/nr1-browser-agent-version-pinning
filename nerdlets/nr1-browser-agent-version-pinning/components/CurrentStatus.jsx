import React from "react";
import { Button, Card, CardBody, CardHeader, CardSection, HeadingText, InlineMessage, Spinner } from "nr1";
import { usePinnedVersion } from "../hooks";

function CurrentStatus() {
  let { version, loading, error } = usePinnedVersion();

  return (
    <Card>
      <CardHeader>
        <HeadingText type={HeadingText.TYPE.HEADING_4}>Current pinning status</HeadingText>
      </CardHeader>
      <CardBody>
        <CardSection>
          <StatusMessage loading={loading} error={error} version={version} />
        </CardSection>
        <CardSection>
          <Button disabled={!version} onClick={() => handleUpdateVersion(null)}>
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

export default CurrentStatus;
