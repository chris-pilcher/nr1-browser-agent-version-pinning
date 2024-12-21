import React from 'react';
import { Button, Card, CardBody, CardHeader, CardSection, HeadingText, InlineMessage, Spinner } from 'nr1';
import { usePinnedVersion } from '../hooks';

function CurrentStatus() {
    let { version, loading, error } = usePinnedVersion();
    return (
        <Card>
            <CardHeader>
                <HeadingText type={HeadingText.TYPE.HEADING_4}>Current pinning status</HeadingText>
            </CardHeader>
            <CardBody>
                <CardSection>
                    {!loading && !error ? (
                        <InlineMessage
                            type={version ? InlineMessage.TYPE.SUCCESS : InlineMessage.TYPE.INFO}
                            label={version ? `Pinned version: ${version}` : `No version pinned`}
                        />
                    ) : (
                        <Spinner inline />
                    )}
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

export default CurrentStatus;
