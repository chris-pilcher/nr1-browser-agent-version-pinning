import React from "react";
import { Badge, Table, TableHeader, TableHeaderCell, TableRow, TableRowCell, BlockText, Link, EmptyState } from "nr1";
import { usePinnedVersionQuery, useModal, useVersionListQuery } from "../hooks";
import { EOL_DOCS_URL } from "../config";

export default function BrowserAgentTable() {
  const versionListQuery = useVersionListQuery();
  const pinnedVersionQuery = usePinnedVersionQuery();
  const { openModal } = useModal();

  if (versionListQuery.isLoading) return <BrowserAgentTableLoading />;
  if (versionListQuery.isError) return <BrowserAgentTableError refetch={versionListQuery.refetch} />;

  const getActions = (itemVersion) => {
    return [
      {
        label: "Pin Version",
        disabled: itemVersion === pinnedVersionQuery.data,
        onClick: (_, { item }) => {
          openModal(item.version);
        },
      },
      {
        label: "Remove Pinning",
        disabled: itemVersion !== pinnedVersionQuery.data,
        onClick: () => {
          openModal(null);
        },
      },
    ];
  };
  // TODO: Review all the text in all the components and see if we can make it more clear. Shorter, more concise, etc.
  return (
    <>
      <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
        The versions in the table below are the{" "}
        <Link to={EOL_DOCS_URL}>currently supported versions of the New Relic browser agent</Link>
      </BlockText>
      <Table items={versionListQuery.data}>
        <TableHeader>
          <TableHeaderCell value={({ item }) => item.version}>Version</TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.startDate}>Support Start Date</TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.endDate}>Support End Date</TableHeaderCell>
        </TableHeader>
        {({ item }) => (
          <TableRow actions={getActions(item.version)}>
            <TableRowCell>
              {item.version}{" "}
              {pinnedVersionQuery.data === item.version && <Badge type={Badge.TYPE.SUCCESS}>Pinned</Badge>}
            </TableRowCell>
            <TableRowCell>{formatToShortDate(item.startDate)}</TableRowCell>
            <TableRowCell>{formatToShortDate(item.endDate)}</TableRowCell>
          </TableRow>
        )}
      </Table>
    </>
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
        to: EOL_DOCS_URL,
      }}
      action={{ label: "Refresh the page", onClick: refetch }}
    />
  );
}

function formatToShortDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
