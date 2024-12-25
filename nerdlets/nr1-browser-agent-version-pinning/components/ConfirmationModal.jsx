import React, { useContext } from "react";
import { BlockText, Button, HeadingText, Modal, Stack, StackItem, Toast } from "nr1";
import { usePinnedVersionMutation, usePinnedVersionQuery } from "../hooks";
import { ModalContext } from "../context";

export default function ConfirmationModal() {
  const { hidden, newVersion, setHidden } = useContext(ModalContext);
  const pinnedVersionQuery = usePinnedVersionQuery();
  const pinnedVersionMutation = usePinnedVersionMutation();

  const updateType = parseUpdateType(pinnedVersionQuery.data, newVersion);

  const title = {
    [UpdateType.REMOVE_PINNING]: "Remove Pinning",
    [UpdateType.ADD_PINNING]: "Add Pinning",
    [UpdateType.UPDATE_PINNING]: "Update Pinning",
  };

  const actionText = {
    [UpdateType.REMOVE_PINNING]: "Remove",
    [UpdateType.ADD_PINNING]: "Pin",
    [UpdateType.UPDATE_PINNING]: "Update",
  };

  const description = {
    [UpdateType.REMOVE_PINNING]: `Are you sure you want to remove the ${pinnedVersionQuery.data} version pinning?`,
    [UpdateType.ADD_PINNING]: `Are you sure you want to pin to version ${newVersion}?`,
    [UpdateType.UPDATE_PINNING]: `Are you sure you want to update the version pinning from ${pinnedVersionQuery.data} to ${newVersion}?`,
  };

  const handleUpdatePinnedVersion = () => {
    pinnedVersionMutation.mutate(newVersion, {
      onSuccess: () => showSuccessToast(newVersion),
      onError: () => showErrorToast(handleUpdatePinnedVersion),
      onSettled: closeModal,
    });
  };

  const closeModal = () => {
    setHidden(true);
  };

  return (
    <Modal hidden={hidden} onClose={closeModal}>
      <HeadingText type={HeadingText.TYPE.HEADING_3}>{title[updateType]}</HeadingText>
      <BlockText spacingType={[BlockText.SPACING_TYPE.EXTRA_LARGE, BlockText.SPACING_TYPE.OMIT]}>
        {description[updateType]}
      </BlockText>
      <Stack>
        <StackItem>
          <Button onClick={closeModal}>Cancel</Button>
        </StackItem>
        <StackItem>
          <Button
            type={updateType === UpdateType.REMOVE_PINNING ? Button.TYPE.DESTRUCTIVE : Button.TYPE.PRIMARY}
            onClick={handleUpdatePinnedVersion}
            loading={pinnedVersionMutation.isLoading}>
            {actionText[updateType]}
          </Button>
        </StackItem>
      </Stack>
    </Modal>
  );
}

const UpdateType = {
  REMOVE_PINNING: "remove",
  ADD_PINNING: "pin",
  UPDATE_PINNING: "change",
};

function parseUpdateType(currentVersion, newVersion) {
  if (!newVersion) {
    return UpdateType.REMOVE_PINNING;
  } else if (!currentVersion) {
    return UpdateType.ADD_PINNING;
  } else {
    return UpdateType.UPDATE_PINNING;
  }
}

function showSuccessToast(version) {
  Toast.showToast({
    title: "Updated",
    description: version ? `Pinned version updated to ${version}` : "Pinning removed",
    type: Toast.TYPE.NORMAL,
  });
}

function showErrorToast(retry) {
  Toast.showToast({
    title: "Update Failed",
    description: "Failed to update pinned version",
    actions: [{ label: "Retry", onClick: retry }],
    type: Toast.TYPE.CRITICAL,
  });
}
