import React, { useState } from 'react';
import { BlockText, Button, HeadingText, Modal, Stack, StackItem } from 'nr1';

function ConfirmationModal({ showModal, currentVersion, newVersion, onCancel, onConfirm }) {
    const isRemovingPinning = newVersion === null;
    const titleText = isRemovingPinning ? 'Remove Pinning' : 'Update Pinning';
    const messageText = createMessageText(isRemovingPinning, currentVersion, newVersion);
    const actionText = isRemovingPinning ? 'Remove Pinning' : `Pin to ${newVersion}`;
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
                        onClick={async () => {
                            setIsUpdating(true);
                            await onConfirm();
                            setIsUpdating(false);
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
        return `Are you sure you want to remove the ${currentVersion} version pinning?`;
    }

    if (currentVersion === null) {
        return `Are you sure you want to pin to version ${newVersion}?`;
    }

    return `Are you sure you want to update the version pinning from ${currentVersion} to ${newVersion}?`;
}

export default ConfirmationModal;
