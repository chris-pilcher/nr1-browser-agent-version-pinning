import React, { useContext, useState } from 'react';
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
    InlineMessage,
    Link,
    NerdGraphQuery,
    NerdGraphMutation,
    NerdletStateContext,
    Tabs,
    TabsItem,
    Spinner,
} from 'nr1';
import { BrowserAgentTable, CustomVersionForm } from './components';
import { UPDATE_PINNED_VERSION } from './graphql/mutations';
// import { usePinnedVersion } from './hooks/usePinnedVersion';
import { FETCH_PINNED_VERSION } from './graphql/queries';

function Nr1BrowserAgentVersionPinningNerdlet() {
    const { entityGuid } = useContext(NerdletStateContext);
    // TODO: Add a loading state using pinnedVersionLoading. Show error message using pinnedVersionError.
    // const { pinnedVersion, setPinnedVersion, pinnedVersionError, pinnedVersionLoading } = usePinnedVersion(entityGuid);

    // const handleUpdateVersion = async (pinnedVersion) => {
    //     setNewVersion(pinnedVersion);
    //     setShowConfirmationModal(true);
    // };

    return (
        <NerdGraphQuery
            query={FETCH_PINNED_VERSION}
            variables={{ browserAppGuid: entityGuid }}
            fetchPolicyType={NerdGraphQuery.FETCH_POLICY_TYPE.CACHE_AND_NETWORK}
        >
            {({ loading, error, data }) => {
                // if (loading) return <BlockText>Loading...</BlockText>;
                // if (error) return <BlockText>{error.message}</BlockText>;
                const successfullyLoaded = !loading && !error;
                const pinnedVersion = data?.actor.entity.browserSettings.browserMonitoring.pinnedVersion;
                return (
                    <>
                        <Grid>
                            <GridItem columnSpan={12}>
                                <Card>
                                    <CardHeader>
                                        <HeadingText type={HeadingText.TYPE.HEADING_4}>Version pinning</HeadingText>
                                    </CardHeader>
                                    <CardBody>
                                        <BlockText
                                            spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}
                                        >
                                            Pin a specific version of the New Relic Browser agent to ensure platform
                                            consistency.
                                        </BlockText>
                                        <BlockText
                                            spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}
                                        >
                                            This extension for New Relic One simplifies browser agent version pinning,
                                            eliminating the need to use the NerdGraph API directly.
                                        </BlockText>
                                        <BlockText
                                            spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}
                                        >
                                            For more information, see the {/*TODO: Consts file for links*/}
                                            <Link to="https://docs.newrelic.com/docs/apis/nerdgraph/examples/browser-monitoring-config-nerdgraph/#browser-agent-version-pinning">
                                                Browser Agent Version Pinning documentation
                                            </Link>
                                        </BlockText>
                                    </CardBody>
                                </Card>
                            </GridItem>
                            <GridItem columnSpan={12}>
                                <Card>
                                    <CardHeader>
                                        <HeadingText type={HeadingText.TYPE.HEADING_4}>
                                            Current pinning status
                                        </HeadingText>
                                    </CardHeader>
                                    <CardBody>
                                        <CardSection>
                                            <CardSection>
                                                {successfullyLoaded ? (
                                                    <InlineMessage
                                                        type={
                                                            pinnedVersion
                                                                ? InlineMessage.TYPE.SUCCESS
                                                                : InlineMessage.TYPE.INFO
                                                        }
                                                        label={
                                                            pinnedVersion
                                                                ? `Pinned version: ${pinnedVersion}`
                                                                : `No version pinned`
                                                        }
                                                    />
                                                ) : (
                                                    <Spinner inline />
                                                )}
                                            </CardSection>
                                        </CardSection>
                                        <CardSection>
                                            <Button disabled={!pinnedVersion} onClick={() => handleUpdateVersion(null)}>
                                                Remove Pinning
                                            </Button>
                                        </CardSection>
                                    </CardBody>
                                </Card>
                            </GridItem>
                            <GridItem columnSpan={12}>
                                <Card>
                                    <CardHeader>
                                        <HeadingText
                                            type={HeadingText.TYPE.HEADING_4}
                                            spacingType={[
                                                HeadingText.SPACING_TYPE.MEDIUM,
                                                HeadingText.SPACING_TYPE.NONE,
                                            ]}
                                        >
                                            Manage pinning
                                        </HeadingText>
                                    </CardHeader>
                                    <CardBody>
                                        <Tabs defaultValue="supported">
                                            <TabsItem value="supported" label="Supported versions">
                                                <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
                                                    The versions in the table below are the{' '}
                                                    <Link to="https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/browser-agent-eol-policy/">
                                                        currently supported versions of the New Relic browser agent
                                                    </Link>
                                                </BlockText>
                                                {/*TODO: What happens when I do not have permission to update pinning?*/}
                                                <BrowserAgentTable />
                                                />
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
                    </>
                );
            }}
        </NerdGraphQuery>
    );
}

export default Nr1BrowserAgentVersionPinningNerdlet;
