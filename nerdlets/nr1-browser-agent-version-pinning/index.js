import React, { useState, useEffect } from 'react';
import {
    NerdGraphQuery,
    NerdGraphMutation,
    ngql,
    InlineMessage,
    Card,
    CardHeader,
    CardBody,
    CardSection,
    CardSectionHeader,
    CardSectionBody,
    Grid,
    GridItem,
    NerdletStateContext,
    Toast,
    HeadingText,
    BlockText,
    Link,
} from 'nr1';
import BrowserAgentTable from './BrowserAgentTable';

// TODO: Consider the name of the component
function Nr1BrowserAgentVersionPinningNerdlet() {
    const [currentVersion, setCurrentVersion] = useState('');
    const [browserAppGuid, setBrowserAppGuid] = useState('');

    useEffect(() => {
        if (browserAppGuid) {
            fetchPinnedVersion(browserAppGuid);
        }
    }, [browserAppGuid]);

    const fetchPinnedVersion = async (browserAppGuid) => {
        const query = `
            query FetchBrowserMonitoringAgentSettings {
                actor {
                    entity(guid: "${browserAppGuid}") {
                        ... on BrowserApplicationEntity {
                            browserSettings {
                                browserMonitoring {
                                    pinnedVersion
                                }
                            }
                        }
                    }
                }
            }
        `;

        try {
            const response = await NerdGraphQuery.query({ query });
            const pinnedVersion = response?.data?.actor?.entity?.browserSettings?.browserMonitoring?.pinnedVersion;

            setCurrentVersion(pinnedVersion || 'None');
        } catch (error) {
            console.error('Error fetching pinned version:', error);
            setCurrentVersion('Error fetching version');
        }
    };

    const handleUpdateVersion = async (pinnedVersion) => {
        if (!browserAppGuid) {
            console.error('Browser App GUID is missing.');
            return;
        }

        try {
            const response = await NerdGraphMutation.mutate({
                mutation: ngql`
                    mutation($guid: EntityGuid!, $pinnedVersion: String) {
                        agentApplicationSettingsUpdate(
                            guid: $guid
                            settings: { browserMonitoring: { pinnedVersion: $pinnedVersion } }
                        ) {
                            browserProperties {
                                jsLoaderScript
                            }
                            browserSettings {
                                browserMonitoring {
                                    loader
                                    pinnedVersion
                                }
                            }
                        }
                    }
                `,
                variables: {
                    guid: browserAppGuid,
                    pinnedVersion: pinnedVersion,
                },
            });

            if (response.errors) {
                console.error('Error updating pinned version:', response.errors);
                Toast.showToast({
                    title: 'Update Failed',
                    description: 'Failed to update pinned version',
                    actions: [{ label: 'Retry', onClick: () => handleUpdateVersion(pinnedVersion) }],
                    type: Toast.TYPE.CRITICAL,
                });
                return;
            }

            Toast.showToast({
                title: 'Updated',
                description: pinnedVersion ? `Pinned version updated to ${pinnedVersion}` : 'Pinning removed',
                type: Toast.TYPE.NORMAL,
            });

            // Update the current version
            setCurrentVersion(pinnedVersion || 'None');
        } catch (error) {
            console.error('Mutation failed:', error);
            Toast.showToast({
                title: 'Update Failed',
                description: 'Failed to update pinned version',
                actions: [{ label: 'Retry', onClick: () => handleUpdateVersion(pinnedVersion) }],
                type: Toast.TYPE.CRITICAL,
            });
        }
    };

    return (
        <NerdletStateContext.Consumer>
            {(nerdletState) => {
                const browserAppGuid = nerdletState?.entityGuid;
                setBrowserAppGuid(browserAppGuid);
                if (!browserAppGuid) {
                    return (
                        <InlineMessage
                            type={InlineMessage.TYPE.CRITICAL}
                            label="No entity context found."
                            description="This Nerdlet must be opened within an entity view."
                        />
                    );
                }

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
                                            For more information, see the{' '}
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
                                        <HeadingText type={HeadingText.TYPE.HEADING_4}>Current pinning</HeadingText>
                                    </CardHeader>
                                    <CardBody>
                                        <InlineMessage
                                            type={InlineMessage.TYPE.SUCCESS}
                                            label={`Current Pinned Version ${currentVersion}`}
                                        />
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
                                        <CardSection collapsible>
                                            <CardSectionHeader title="Supported Versions" />
                                            <CardSectionBody>
                                                <BlockText
                                                    spacingType={[
                                                        BlockText.SPACING_TYPE.MEDIUM,
                                                        BlockText.SPACING_TYPE.NONE,
                                                    ]}
                                                >
                                                    The versions in the table below are the{' '}
                                                    <Link to="https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/browser-agent-eol-policy/">
                                                        currently supported versions
                                                    </Link>{' '}
                                                    of the New Relic browser agent.
                                                </BlockText>
                                                <BrowserAgentTable
                                                    currentPinnedVersion={currentVersion}
                                                    onUpdateVersion={handleUpdateVersion}
                                                />
                                            </CardSectionBody>
                                        </CardSection>
                                        <CardSection collapsible defaultCollapsed>
                                            <CardSectionHeader title="Manually Specify Version" />
                                            <CardSectionBody>TODO: Support for other versions</CardSectionBody>
                                        </CardSection>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </Grid>
                    </>
                );
            }}
        </NerdletStateContext.Consumer>
    );
}

export default Nr1BrowserAgentVersionPinningNerdlet;
