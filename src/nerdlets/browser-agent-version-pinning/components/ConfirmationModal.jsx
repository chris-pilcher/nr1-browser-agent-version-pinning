import React, { useContext, Fragment } from "react";
import { BlockText, Button, HeadingText, Modal, SectionMessage, Spinner, Stack, StackItem, Toast } from "nr1";
import { usePinnedVersionMutation, usePinnedVersionQuery } from "../hooks";
import { ModalContext } from "../context";

export default function ConfirmationModal() {
  const { hidden, newVersion, setHidden } = useContext(ModalContext);
  const pinnedVersionQuery = usePinnedVersionQuery();
  const pinnedVersionMutation = usePinnedVersionMutation();

  const version = pinnedVersionQuery.data;
  const updateType = parseUpdateType(version, newVersion);

  const title = {
    [UpdateType.ADD_PINNING]: "Add Pinning",
    [UpdateType.UPDATE_PINNING]: "Update Pinning",
    [UpdateType.REMOVE_PINNING]: "Remove Pinning",
  };

  const actionText = {
    [UpdateType.ADD_PINNING]: "Pin",
    [UpdateType.UPDATE_PINNING]: "Update",
    [UpdateType.REMOVE_PINNING]: "Remove",
  };

  const description = {
    [UpdateType.ADD_PINNING]: `Are you sure you want to pin to version ${newVersion}?`,
    [UpdateType.UPDATE_PINNING]: `Are you sure you want to update the version pinning from ${version} to ${newVersion}?`,
    [UpdateType.REMOVE_PINNING]: `Are you sure you want to remove the ${version} version pinning?`,
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
      {pinnedVersionQuery.isLoading && <Spinner inline />}
      {pinnedVersionQuery.isError && (
        <SectionMessage
          type={SectionMessage.TYPE.CRITICAL}
          title="Failed to fetch pinned version"
          description="An error occurred while trying to fetch the current pinned version. Please try again later."
        />
      )}
      {pinnedVersionQuery.isSuccess && (
        <Fragment>
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
        </Fragment>
      )}
    </Modal>
  );
}

const UpdateType = {
  ADD_PINNING: "pin",
  UPDATE_PINNING: "change",
  REMOVE_PINNING: "remove",
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
