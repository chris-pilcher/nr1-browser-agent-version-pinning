import React, { useContext, useEffect, useState } from 'react';
import {
    Badge,
    NerdGraphQuery,
    NerdletStateContext,
    Table,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableRowCell,
    BlockText,
} from 'nr1';
import { FETCH_PINNED_VERSION } from '../../graphql/queries';

const BrowserAgentTable = ({ currentPinnedVersion, onUpdateVersion }) => {
    const [eolData, setEolData] = useState([]);
    const { entityGuid } = useContext(NerdletStateContext);

    useEffect(() => {
        fetch('https://chris-pilcher.github.io/nr1-browser-agent-version-pinning/browser-agent-eol-policy.json')
            .then((resultJson) => resultJson.json())
            .then(setEolData)
            .catch(console.error); // TODO: Use the logger provided by the Nerdpack SDK
    }, []);

    const getActions = (itemVersion) => {
        return [
            {
                label: 'Pin Version',
                disabled: itemVersion === currentPinnedVersion,
                onClick: (_, { item }) => {
                    onUpdateVersion(item.version);
                },
            },
            {
                label: 'Remove Pinning',
                disabled: itemVersion !== currentPinnedVersion,
                onClick: () => {
                    onUpdateVersion(null);
                },
            },
        ];
    };
    return (
        <NerdGraphQuery
            query={FETCH_PINNED_VERSION}
            variables={{ browserAppGuid: entityGuid }}
            fetchPolicyType={NerdGraphQuery.FETCH_POLICY_TYPE.CACHE_ONLY}
        >
            {({ data, loading, error }) => {
                if (loading) return <BlockText>Loading...</BlockText>;
                if (error) return <BlockText>{error.message}</BlockText>;
                return (
                    <Table items={eolData}>
                        <TableHeader>
                            <TableHeaderCell value={({ item }) => item.version}>Version</TableHeaderCell>
                            <TableHeaderCell value={({ item }) => item.startDate}>Support Start Date</TableHeaderCell>
                            <TableHeaderCell value={({ item }) => item.endDate}>Support End Date</TableHeaderCell>
                        </TableHeader>

                        {({ item }) => (
                            <TableRow actions={getActions(item.version)}>
                                <TableRowCell>
                                    {item.version}{' '}
                                    {data?.actor?.entity?.browserSettings?.browserMonitoring?.pinnedVersion ===
                                        item.version && <Badge type={Badge.TYPE.SUCCESS}>Current</Badge>}
                                </TableRowCell>
                                <TableRowCell>
                                    {new Date(item.startDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </TableRowCell>
                                <TableRowCell>
                                    {new Date(item.endDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </TableRowCell>
                            </TableRow>
                        )}
                    </Table>
                );
            }}
        </NerdGraphQuery>
    );
};

export default BrowserAgentTable;
