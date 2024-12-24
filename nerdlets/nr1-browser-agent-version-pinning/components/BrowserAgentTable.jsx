import React from "react";
import { Badge, Table, TableHeader, TableHeaderCell, TableRow, TableRowCell, BlockText, Link, EmptyState } from "nr1";
import { usePinnedVersion, useModal } from "../hooks";
import useEolData from "../hooks/useEolData";
import { EOL_DATA_URL, EOL_DOCS_URL } from "../config";
import { useQuery } from "@tanstack/react-query";

export default function BrowserAgentTable() {
  // const { eolData, loading, error, refetch } = useEolData();
  const { data: eolData, isLoading: loading, error, refetch } = useQuery({
    queryKey: ["eol"],
    queryFn: () => fetch(EOL_DATA_URL).then((res) => res.json()),
  });

  const { version } = usePinnedVersion();
  const { openModal } = useModal();

  if (loading)
    return (
      <EmptyState
        title="Fetching the currently supported versions of the New Relic browser agent"
        type={EmptyState.TYPE.LOADING}
      />
    );

  if (error)
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
  const getActions = (itemVersion) => {
    return [
      {
        label: "Pin Version",
        disabled: itemVersion === version,
        onClick: (_, { item }) => {
          openModal(item.version);
        },
      },
      {
        label: "Remove Pinning",
        disabled: itemVersion !== version,
        onClick: () => {
          openModal(null);
        },
      },
    ];
  };
  return (
    <>
      <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
        The versions in the table below are the{" "}
        <Link to={EOL_DOCS_URL}>currently supported versions of the New Relic browser agent</Link>
      </BlockText>
      <Table items={eolData}>
        <TableHeader>
          <TableHeaderCell value={({ item }) => item.version}>Version</TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.startDate}>Support Start Date</TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.endDate}>Support End Date</TableHeaderCell>
        </TableHeader>

        {({ item }) => (
          <TableRow actions={getActions(item.version)}>
            <TableRowCell>
              {item.version} {version === item.version && <Badge type={Badge.TYPE.SUCCESS}>Pinned</Badge>}
            </TableRowCell>
            <TableRowCell>
              {new Date(item.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableRowCell>
            <TableRowCell>
              {new Date(item.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableRowCell>
          </TableRow>
        )}
      </Table>
    </>
  );
}
