import React, { useState, useEffect } from 'react';
import {
    Button,
    NerdGraphQuery,
    NerdGraphMutation,
    ngql,
    InlineMessage,
    Card,
    CardHeader,
    CardBody,
    Grid,
    GridItem,
    RadioGroup,
    Radio,
    Form,
    NerdletStateContext,
    Badge,
    Stack,
    StackItem,
    Toast,
} from 'nr1';
import BrowserAgentTable from './BrowserAgentTable';

const Nr1BrowserAgentVersionPinningNerdlet = () => {
    const [currentVersion, setCurrentVersion] = useState('');
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState('');
    const [browserAppGuid, setBrowserAppGuid] = useState('');

    useEffect(() => {
        if (browserAppGuid) {
            fetchPinnedVersion(browserAppGuid);
        }
    }, [browserAppGuid]);

    useEffect(() => {
        fetchReleases();
    }, []);

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

            setCurrentVersion(pinnedVersion || 'Not pinned');
            setSelectedVersion(pinnedVersion);
        } catch (error) {
            console.error('Error fetching pinned version:', error);
            setCurrentVersion('Error fetching version');
        } finally {
            setLoading(false);
        }
    };

    const fetchReleases = async () => {
        try {
            //  TODO: Instead of using the GitHub API, query
            //  https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/browser-agent-eol-policy/
            //  to get version + start and EOL date. Make EOL in 3 months make it orange, expired make it red.
            const response = await fetch('https://api.github.com/repos/newrelic/newrelic-browser-agent/releases');
            const data = await response.json();

            const formattedReleases = data.map((release) => ({
                tagName: release.tag_name.replace(/^v/, ''),
                date: new Date(release.published_at).toISOString().split('T')[0],
            }));

            setReleases(formattedReleases);
        } catch (error) {
            console.error('Error fetching releases:', error);
        } finally {
            // setDropdownLoading(false);
        }
    };

    const handleUpdateVersion = async () => {
        if (!browserAppGuid || !selectedVersion) {
            console.error('Browser App GUID or selected version is missing.');
            return;
        }

        try {
            const response = await NerdGraphMutation.mutate({
                mutation: ngql`
                    mutation($guid: EntityGuid!, $version: String!) {
                        agentApplicationSettingsUpdate(
                            guid: $guid
                            settings: { browserMonitoring: { pinnedVersion: $version } }
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
                    version: selectedVersion,
                },
            });

            if (response.errors) {
                Toast.showToast({
                    title: 'Update Failed',
                    description: 'Failed to pin the selected version. Please try again.',
                    type: Toast.TYPE.CRITICAL,
                });
                console.error('Error updating pinned version:', response.errors);
                return;
            }
            Toast.showToast({
                title: 'Version Updated',
                description: `Pinned version successfully updated to: ${selectedVersion}`,
                type: Toast.TYPE.NORMAL,
            });
            setCurrentVersion(selectedVersion);
        } catch (error) {
            console.error('Mutation failed:', error);
            Toast.showToast({
                title: 'Update Failed',
                description: 'Failed to pin the selected version. Please try again.',
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
                            <Card>
                                <CardHeader title={'Select a version to pin'} />
                                <CardBody>
                                    <Form>
                                        <RadioGroup
                                            value={selectedVersion}
                                            onChange={(event, value) => {
                                                setSelectedVersion(value);
                                            }}
                                        >
                                            <Radio label="No Pinning (use latest)" />
                                            {releases.map((release) => (
                                                <Radio
                                                    key={release.tagName}
                                                    label={
                                                        <Stack>
                                                            <StackItem>{release.tagName} </StackItem>
                                                            <StackItem>
                                                                <Badge>{release.date}</Badge>
                                                            </StackItem>
                                                        </Stack>
                                                    }
                                                    value={release.tagName}
                                                />
                                            ))}
                                            <Radio label={'Custom version'} />
                                        </RadioGroup>
                                        <Button
                                            type={Button.TYPE.PRIMARY}
                                            sizeType={Button.SIZE_TYPE.SMALL}
                                            onClick={handleUpdateVersion}
                                            disabled={!selectedVersion || loading}
                                        >
                                            Update Version
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem columnSpan={12}>
                            <BrowserAgentTable />
                        </GridItem>
                    </Grid>
                );
            }}
        </NerdletStateContext.Consumer>
    );
};

export default Nr1BrowserAgentVersionPinningNerdlet;
