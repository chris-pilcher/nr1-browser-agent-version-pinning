import React, { useContext } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardSection,
    HeadingText,
    InlineMessage,
    Spinner,
    NerdletStateContext,
    NerdGraphQuery,
} from 'nr1';
import { FETCH_PINNED_VERSION } from '../../graphql/queries';

export default function CurrentStatus() {
    const { entityGuid } = useContext(NerdletStateContext);
    return (
        <NerdGraphQuery
            query={FETCH_PINNED_VERSION}
            variables={{ browserAppGuid: entityGuid }}
            fetchPolicyType={NerdGraphQuery.FETCH_POLICY_TYPE.CACHE_ONLY}
        >
            {({ data, loading, error }) => {
                const successfullyLoaded = data != null && !loading && !error;
                const pinnedVersion = data?.actor.entity.browserSettings.browserMonitoring.pinnedVersion;
                return (
                    <Card>
                        <CardHeader>
                            <HeadingText type={HeadingText.TYPE.HEADING_4}>Current pinning status</HeadingText>
                        </CardHeader>
                        <CardBody>
                            <CardSection>
                                {successfullyLoaded ? (
                                    <InlineMessage
                                        type={pinnedVersion ? InlineMessage.TYPE.SUCCESS : InlineMessage.TYPE.INFO}
                                        label={pinnedVersion ? `Pinned version: ${pinnedVersion}` : `No version pinned`}
                                    />
                                ) : (
                                    <Spinner inline />
                                )}
                            </CardSection>
                            <CardSection>
                                <Button disabled={!pinnedVersion} onClick={() => handleUpdateVersion(null)}>
                                    Remove Pinning
                                </Button>
                            </CardSection>
                        </CardBody>
                    </Card>
                );
            }}
        </NerdGraphQuery>
    );
}
