import React, { useState, useEffect } from 'react';
import {
    NerdGraphQuery,
    NerdGraphMutation,
    ngql,
    InlineMessage,
    Card,
    CardHeader,
    CardBody,
    Grid,
    GridItem,
    NerdletStateContext,
    Toast,
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
                    <Grid>
                        <GridItem columnSpan={6}>
                            <Card>
                                <CardHeader
                                    title="Browser Agent Version Pinning"
                                    subtitle="Current Browser Agent Version"
                                />
                                <CardBody>
                                    <InlineMessage
                                        type={InlineMessage.TYPE.SUCCESS}
                                        label={`Current Pinned Version: ${currentVersion}`}
                                    />
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem columnSpan={12}>
                            <BrowserAgentTable
                                currentPinnedVersion={currentVersion}
                                onUpdateVersion={handleUpdateVersion}
                            />
                        </GridItem>
                    </Grid>
                );
            }}
        </NerdletStateContext.Consumer>
    );
}

export default Nr1BrowserAgentVersionPinningNerdlet;
