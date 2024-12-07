import React, { useEffect, useState } from 'react';
import { Badge, Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from 'nr1';

const BrowserAgentTable = ({ currentPinnedVersion, onUpdateVersion }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // TODO: Handle errors
            let scrapedEolData =
                'https://chris-pilcher.github.io/nr1-browser-agent-version-pinning/browser-agent-eol-policy.json';
            const result = await fetch(scrapedEolData);
            const resultJson = await result.json();
            setData(resultJson);
        };

        fetchData();
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
        <React.Fragment>
            <Table items={data}>
                <TableHeader>
                    <TableHeaderCell value={({ item }) => item.version}>Version</TableHeaderCell>
                    <TableHeaderCell value={({ item }) => item.startDate}>Support Start Date</TableHeaderCell>
                    <TableHeaderCell value={({ item }) => item.endDate}>Support End Date</TableHeaderCell>
                </TableHeader>

                {({ item }) => (
                    <TableRow actions={getActions(item.version)}>
                        <TableRowCell>
                            {item.version}{' '}
                            {currentPinnedVersion === item.version && <Badge type={Badge.TYPE.SUCCESS}>Current</Badge>}
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
        </React.Fragment>
    );
};

export default BrowserAgentTable;
