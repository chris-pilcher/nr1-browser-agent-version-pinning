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
    Grid,
    GridItem,
    NerdletStateContext,
    Toast,
    HeadingText,
    BlockText,
    Link,
    Tabs,
    TabsItem,
    Button,
} from 'nr1';
import BrowserAgentTable from './BrowserAgentTable';
import CustomVersionForm from './CustomVersionForm';
import ConfirmationModal from './ConfirmationModal';

// TODO: Consider the name of the component
function Nr1BrowserAgentVersionPinningNerdlet() {
    const [currentVersion, setCurrentVersion] = useState('');
    const [newVersion, setNewVersion] = useState(null);
    const [browserAppGuid, setBrowserAppGuid] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        if (browserAppGuid) {
            fetchPinnedVersion(browserAppGuid);
        }
    }, [browserAppGuid]);

    const isVersionEmpty = !currentVersion;

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

            setCurrentVersion(pinnedVersion);
        } catch (error) {
            console.error('Error fetching pinned version:', error);
            setCurrentVersion('Error fetching version');
        }
    };

    const handleUpdateVersion = async (pinnedVersion) => {
        setNewVersion(pinnedVersion);
        setShowConfirmationModal(true);
    };

    const onUpdateVersion = async () => {
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
                    pinnedVersion: newVersion,
                },
            });

            if (response.errors) {
                console.error('Error updating pinned version:', response.errors);
                Toast.showToast({
                    title: 'Update Failed',
                    description: 'Failed to update pinned version',
                    actions: [{ label: 'Retry', onClick: () => handleUpdateVersion(newVersion) }],
                    type: Toast.TYPE.CRITICAL,
                });
                return;
            }

            Toast.showToast({
                title: 'Updated',
                description: newVersion ? `Pinned version updated to ${newVersion}` : 'Pinning removed',
                type: Toast.TYPE.NORMAL,
            });

            // Update the current version
            setCurrentVersion(newVersion);
        } catch (error) {
            console.error('Mutation failed:', error);
            Toast.showToast({
                title: 'Update Failed',
                description: 'Failed to update pinned version',
                actions: [{ label: 'Retry', onClick: () => handleUpdateVersion(newVersion) }],
                type: Toast.TYPE.CRITICAL,
            });
        } finally {
            setShowConfirmationModal(false);
        }
    };
    // TODO: Make sure modal stays open when the user clicks delete. Show spinner while updating

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
                        <ConfirmationModal
                            showModal={showConfirmationModal}
                            currentVersion={currentVersion}
                            newVersion={newVersion}
                            onConfirm={async () => await onUpdateVersion()}
                            onCancel={() => setShowConfirmationModal(false)}
                        />
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
                                            {isVersionEmpty ? (
                                                <InlineMessage
                                                    type={InlineMessage.TYPE.INFO}
                                                    label={`No version pinned`}
                                                />
                                            ) : (
                                                <InlineMessage
                                                    type={InlineMessage.TYPE.SUCCESS}
                                                    label={`Pinned version: ${currentVersion}`}
                                                />
                                            )}
                                        </CardSection>
                                        <CardSection>
                                            <Button disabled={isVersionEmpty} onClick={() => handleUpdateVersion(null)}>
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
                                                <BrowserAgentTable
                                                    currentPinnedVersion={currentVersion}
                                                    onUpdateVersion={handleUpdateVersion}
                                                />
                                            </TabsItem>
                                            <TabsItem value="custom" label="Custom version">
                                                <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
                                                    Specify a version based on the release number from{' '}
                                                    <Link to="https://github.com/newrelic/newrelic-browser-agent/releases">
                                                        GitHub
                                                    </Link>
                                                </BlockText>
                                                <CustomVersionForm
                                                    currentPinnedVersion={currentVersion}
                                                    onUpdateVersion={handleUpdateVersion}
                                                />
                                            </TabsItem>
                                        </Tabs>
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
