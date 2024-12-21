import React, { Fragment } from "react";
import { BlockText, Button, HeadingText, Modal, Stack, StackItem, Toast } from "nr1";
import { useUpdatePinnedVersion, usePinnedVersion } from "../hooks";

function ConfirmationModal({ hidden, newVersion, onClose }) {
  const isRemovingPinning = newVersion === null;
  const titleText = isRemovingPinning ? "Remove Pinning" : "Update Pinning";
  const actionText = isRemovingPinning ? "Remove" : "Pin";
  const { version } = usePinnedVersion();
  const { updatePinnedVersion, isLoading } = useUpdatePinnedVersion();
  const messageText = createMessageText(isRemovingPinning, version, newVersion);

  const handleUpdatePinnedVersion = () => {
    updatePinnedVersion(newVersion)
      .then(() => {
        Toast.showToast({
          title: "Updated",
          description: newVersion ? `Pinned version updated to ${newVersion}` : "Pinning removed",
          type: Toast.TYPE.NORMAL,
        });
      })
      .catch(() => {
        Toast.showToast({
          title: "Update Failed",
          description: "Failed to update pinned version",
          actions: [{ label: "Retry", onClick: handleUpdatePinnedVersion }],
          type: Toast.TYPE.CRITICAL,
        });
      }).finally(() => {
        onClose();
    });
  };

  return (
    <Modal hidden={hidden} onClose={onClose}>
      <HeadingText type={HeadingText.TYPE.HEADING_3}>{titleText}</HeadingText>
      <BlockText spacingType={[BlockText.SPACING_TYPE.EXTRA_LARGE, BlockText.SPACING_TYPE.OMIT]}>
        {messageText}
      </BlockText>
      <Stack>
        <StackItem>
          <Button onClick={onClose}>Cancel</Button>
        </StackItem>
        <StackItem>
          <Button
            type={isRemovingPinning ? Button.TYPE.DESTRUCTIVE : Button.TYPE.PRIMARY}
            onClick={handleUpdatePinnedVersion}
            loading={isLoading}>
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

export default ConfirmationModal;
