import {
  Badge,
  BlockText,
  EmptyState,
  Link,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
  Toast,
} from "nr1";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { URLS } from "../constants";
import { useConfirmationModal, usePinnedVersionQuery, useVersionListQuery } from "../hooks";
import { formatToShortDate } from "../utils";

export default function BrowserAgentTable() {
  const versionListQuery = useVersionListQuery();
  const pinnedVersionQuery = usePinnedVersionQuery();
  const confirmationModal = useConfirmationModal();

  const isLoading = versionListQuery.isLoading || pinnedVersionQuery.isLoading;
  const isError = versionListQuery.isError || pinnedVersionQuery.isError;
  const refetch = () => {
    return Promise.all([versionListQuery.refetch(), pinnedVersionQuery.refetch()]);
  };

  if (isLoading) return <BrowserAgentTableLoading />;
  if (isError) return <BrowserAgentTableError refetch={refetch} />;

  return (
    <Fragment>
      <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
        The versions in the table below are the{" "}
        <Link to={URLS.EOL.DOCS}>currently supported versions of the New Relic browser agent</Link>
      </BlockText>
      <Table
        items={versionListQuery.data}
        selectionType={Table.SELECTION_TYPE.SINGLE}
        onSelect={(_, { item }) =>
          item.version === pinnedVersionQuery.data
            ? showAlreadyPinnedToast(item.version)
            : confirmationModal.confirmPin(item.version)
        }>
        <TableHeader>
          <TableHeaderCell value={({ item }) => item.version}>Version</TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.startDate}>Support Start Date</TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.endDate}>Support End Date</TableHeaderCell>
        </TableHeader>
        {({ item }) => (
          <TableRow
            disabled={true}
            actions={[
              {
                label: "Pin Version",
                type: TableRow.ACTION_TYPE.NORMAL,
                disabled: item.version === pinnedVersionQuery.data,
                onClick: (_, { item }) => confirmationModal.confirmPin(item.version),
              },
              {
                label: "Remove Pinning",
                type: TableRow.ACTION_TYPE.DESTRUCTIVE,
                disabled: item.version !== pinnedVersionQuery.data,
                onClick: confirmationModal.confirmRemovePin,
              },
            ]}>
            <TableRowCell>
              {item.version}{" "}
              {pinnedVersionQuery.data === item.version && <Badge type={Badge.TYPE.SUCCESS}>Pinned</Badge>}
            </TableRowCell>
            <TableRowCell>{formatToShortDate(item.startDate)}</TableRowCell>
            <TableRowCell>{formatToShortDate(item.endDate)}</TableRowCell>
          </TableRow>
        )}
      </Table>
    </Fragment>
  );
}

function BrowserAgentTableLoading() {
  return (
    <EmptyState
      title="Fetching the currently supported versions of the New Relic browser agent"
      type={EmptyState.TYPE.LOADING}
    />
  );
}

function BrowserAgentTableError({ refetch }) {
  return (
    <EmptyState
      type={EmptyState.TYPE.ERROR}
      iconType={EmptyState.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__SERVICE__S_ERROR}
      title="We couldn't fetch the currently supported versions of the New Relic browser agent"
      description="Refresh the page to try again."
      additionalInfoLink={{
        label: "Currently supported versions of the New Relic browser agent",
        to: URLS.EOL.DOCS,
      }}
      action={{ label: "Refresh the page", onClick: refetch }}
    />
  );
}

BrowserAgentTableError.propTypes = {
  refetch: PropTypes.func.isRequired,
};

function showAlreadyPinnedToast(version) {
  Toast.showToast({
    title: "Version Already Pinned",
    description: `Version ${version} is pinned. Use the ellipsis (...) menu to unpin.`,
    type: Toast.TYPE.NORMAL,
  });
}
