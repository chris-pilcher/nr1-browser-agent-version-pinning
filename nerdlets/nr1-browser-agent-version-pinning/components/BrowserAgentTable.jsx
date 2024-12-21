import React, { useEffect, useState } from 'react';
import { Badge, Table, TableHeader, TableHeaderCell, TableRow, TableRowCell, BlockText } from 'nr1';
import { ConfirmationModal } from './index';
import { usePinnedVersion } from '../hooks';

function BrowserAgentTable() {
    const [eolData, setEolData] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [newVersion, setNewVersion] = useState(null);
    let { version, loading, error } = usePinnedVersion();

    useEffect(() => {
        fetch('https://chris-pilcher.github.io/nr1-browser-agent-version-pinning/browser-agent-eol-policy.json')
            .then((resultJson) => resultJson.json())
            .then(setEolData)
            .catch(console.error); // TODO: Use the logger provided by the Nerdpack SDK
    }, []);

    if (loading) return <BlockText>Loading...</BlockText>;
    if (error) return <BlockText>{error.message}</BlockText>;

    const getActions = (itemVersion) => {
        return [
            {
                label: 'Pin Version',
                disabled: itemVersion === version,
                onClick: (_, { item }) => {
                    setNewVersion(item.version);
                    setHidden(false);
                },
            },
            {
                label: 'Remove Pinning',
                disabled: itemVersion !== version,
                onClick: () => {
                    setNewVersion(null);
                    setHidden(false);
                },
            },
        ];
    };
    return (
        <>
            <ConfirmationModal hidden={hidden} newVersion={newVersion} onClose={() => setHidden(true)} />
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
                            {version === item.version && <Badge type={Badge.TYPE.SUCCESS}>Current</Badge>}
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
        </>
    );
}

export default BrowserAgentTable;
