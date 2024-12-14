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
    NerdGraphMutation,
    NerdletStateContext,
    Tabs,
    TabsItem,
    Toast,
} from 'nr1';
import { BrowserAgentTable, CustomVersionForm, ConfirmationModal } from './components';
import { UPDATE_PINNED_VERSION } from './graphql/mutations';
import { usePinnedVersion } from './hooks/usePinnedVersion';

function Nr1BrowserAgentVersionPinningNerdlet() {
    const [newVersion, setNewVersion] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const { entityGuid } = useContext(NerdletStateContext);
    // TODO: Add a loading state using pinnedVersionLoading. Show error message using pinnedVersionError.
    const { pinnedVersion, setPinnedVersion, pinnedVersionError, pinnedVersionLoading } = usePinnedVersion(entityGuid);

    const handleUpdateVersion = async (pinnedVersion) => {
        setNewVersion(pinnedVersion);
        setShowConfirmationModal(true);
    };

    const onUpdateVersion = async () => {
        try {
            const response = await NerdGraphMutation.mutate({
                mutation: UPDATE_PINNED_VERSION,
                variables: {
                    guid: entityGuid,
                    pinnedVersion: newVersion,
                },
            });

            if (response.errors) {
                console.error('Error updating pinned version', response.errors);
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

            setShowConfirmationModal(false);
            setPinnedVersion(newVersion);
        } catch (error) {
            setShowConfirmationModal(false);
            console.error('Error updating pinned version', error);
            Toast.showToast({
                title: 'Update Failed',
                description: 'Failed to update pinned version',
                actions: [{ label: 'Retry', onClick: () => handleUpdateVersion(newVersion) }],
                type: Toast.TYPE.CRITICAL,
            });
        }
    };

    return (
        <>
            <ConfirmationModal
                showModal={showConfirmationModal}
                currentVersion={pinnedVersion}
                newVersion={newVersion}
                onConfirm={onUpdateVersion}
                onCancel={() => setShowConfirmationModal(false)}
            />
            <Grid>
                <GridItem columnSpan={12}>
                    <Card>
                        <CardHeader>
                            <HeadingText type={HeadingText.TYPE.HEADING_4}>Version pinning</HeadingText>
                        </CardHeader>
                        <CardBody>
                            <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}>
                                Pin a specific version of the New Relic Browser agent to ensure platform consistency.
                            </BlockText>
                            <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}>
                                This extension for New Relic One simplifies browser agent version pinning, eliminating
                                the need to use the NerdGraph API directly.
                            </BlockText>
                            <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM, BlockText.SPACING_TYPE.NONE]}>
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
                            <HeadingText type={HeadingText.TYPE.HEADING_4}>Current pinning status</HeadingText>
                        </CardHeader>
                        <CardBody>
                            <CardSection>
                                {pinnedVersion ? (
                                    <InlineMessage
                                        type={InlineMessage.TYPE.SUCCESS}
                                        label={`Pinned version: ${pinnedVersion}`}
                                    />
                                ) : (
                                    <InlineMessage type={InlineMessage.TYPE.INFO} label={`No version pinned`} />
                                )}
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
                                spacingType={[HeadingText.SPACING_TYPE.MEDIUM, HeadingText.SPACING_TYPE.NONE]}
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
                                        currentPinnedVersion={pinnedVersion}
                                        onUpdateVersion={handleUpdateVersion}
                                    />
                                </TabsItem>
                                <TabsItem value="custom" label="Custom version">
                                    <CustomVersionForm
                                        currentPinnedVersion={pinnedVersion}
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
}

export default Nr1BrowserAgentVersionPinningNerdlet;
