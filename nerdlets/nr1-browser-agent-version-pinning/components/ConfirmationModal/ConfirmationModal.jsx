import React, { Fragment, useContext, useState } from 'react';
import { BlockText, Button, HeadingText, Modal, Stack, StackItem, NerdletStateContext, NerdGraphMutation, Toast } from 'nr1';
import { UPDATE_PINNED_VERSION } from '../../graphql/mutations';

function ConfirmationModal({ showModal, currentVersion, newVersion, refetch, onCancel, onConfirm }) {
    const { entityGuid } = useContext(NerdletStateContext);
    const isRemovingPinning = newVersion === null;
    const titleText = isRemovingPinning ? 'Remove Pinning' : 'Update Pinning';
    const messageText = createMessageText(isRemovingPinning, currentVersion, newVersion);
    const actionText = isRemovingPinning ? 'Remove' : 'Pin';
    const [isUpdating, setIsUpdating] = useState(false);

    return (
        <Modal hidden={!showModal} onClose={onCancel}>
            <HeadingText type={HeadingText.TYPE.HEADING_3}>{titleText}</HeadingText>
            <BlockText spacingType={[BlockText.SPACING_TYPE.EXTRA_LARGE, BlockText.SPACING_TYPE.OMIT]}>
                {messageText}
            </BlockText>
            <Stack>
                <StackItem>
                    <Button onClick={onCancel}>Cancel</Button>
                </StackItem>
                <StackItem>
                    <Button
                        type={isRemovingPinning ? Button.TYPE.DESTRUCTIVE : Button.TYPE.PRIMARY}
                        onClick={() => {
                            onUpdateVersion(entityGuid, newVersion, refetch, onConfirm, setIsUpdating);
                        }}
                        loading={isUpdating}
                    >
                        {actionText}
                    </Button>
                </StackItem>
            </Stack>
        </Modal>
    );
}

function createMessageText(isRemovingPinning, currentVersion, newVersion) {
    if (isRemovingPinning) {
        return (
            <Fragment>
                Are you sure you want to remove the <b>{currentVersion}</b> version pinning?
            </Fragment>
        );
    }

    if (currentVersion === null) {
        return (
            <Fragment>
                Are you sure you want to pin to version <b>{newVersion}</b>?
            </Fragment>
        );
    }

    return (
        <Fragment>
            Are you sure you want to update the version pinning from {currentVersion} to <b>{newVersion}</b>?
        </Fragment>
    );
}

function onUpdateVersion(entityGuid, newVersion, refetch, onComplete, setIsUpdating) {
    setIsUpdating(true);
    NerdGraphMutation.mutate({
        mutation: UPDATE_PINNED_VERSION,
        variables: {
            guid: entityGuid,
            pinnedVersion: newVersion,
        },
    })
        .then((response) => {
            if (response.errors) {
                console.log('Error updating pinned version', response.errors);
                throw new Error('Error updating pinned version');
            }
            refetch().finally(() => {
                Toast.showToast({
                    title: 'Updated',
                    description: newVersion ? `Pinned version updated to ${newVersion}` : 'Pinning removed',
                    type: Toast.TYPE.NORMAL,
                });
            });

        })
        .catch((e) => {
            console.log(e); // TODO: Use the logger that nerdlets provides
            Toast.showToast({
                title: 'Update Failed',
                description: 'Failed to update pinned version',
                actions: [{ label: 'Retry', onClick: () => handleUpdateVersion(newVersion) }],
                type: Toast.TYPE.CRITICAL,
            });
        })
        .finally(() => {
            onComplete();
            setIsUpdating(false);
        });
}

export default ConfirmationModal;
