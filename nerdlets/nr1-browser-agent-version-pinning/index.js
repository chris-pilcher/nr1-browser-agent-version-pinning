import React, { useState, useEffect } from 'react';
import {
    Button,
    NerdGraphQuery,
    InlineMessage,
    Card,
    CardHeader,
    CardBody,
    HeadingText,
    Grid,
    GridItem,
    RadioGroup,
    Radio,
    Form,
    NerdletStateContext,
} from 'nr1';

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
            const pinnedVersion =
                response?.data?.actor?.entity?.browserSettings
                    ?.browserMonitoring?.pinnedVersion;

            setCurrentVersion(pinnedVersion || 'Not pinned');
        } catch (error) {
            console.error('Error fetching pinned version:', error);
            setCurrentVersion('Error fetching version');
        } finally {
            setLoading(false);
        }
    };

    const fetchReleases = async () => {
        try {
            const response = await fetch(
                'https://api.github.com/repos/newrelic/newrelic-browser-agent/releases'
            );
            const data = await response.json();

            const formattedReleases = data.map((release) => ({
                tagName: release.tag_name,
                date: new Date(release.published_at).toLocaleDateString(
                    'en-US',
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }
                ),
            }));

            setReleases(formattedReleases);
        } catch (error) {
            console.error('Error fetching releases:', error);
        } finally {
            // setDropdownLoading(false);
        }
    };

    const handleUpdateVersion = () => {
        console.log(`Updating version to: ${newVersion}`);
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
                                                    label={`${release.tagName} (${release.date})`}
                                                    value={release.tagName}
                                                />
                                            ))}
                                            <Radio label={'Custom version'} />
                                        </RadioGroup>
                                        <Button
                                            type={Button.TYPE.PRIMARY}
                                            sizeType={Button.SIZE_TYPE.SMALL}
                                            onClick={handleUpdateVersion}
                                            disabled={
                                                !selectedVersion || loading
                                            }
                                        >
                                            Update Version
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </Grid>
                );
            }}
        </NerdletStateContext.Consumer>
    );
};

export default Nr1BrowserAgentVersionPinningNerdlet;
