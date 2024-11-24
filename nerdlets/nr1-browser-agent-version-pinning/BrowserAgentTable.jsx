import React, { useEffect, useState } from 'react';
import { scrapeBrowserAgentData } from './scrape';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from 'nr1';

const BrowserAgentTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // TODO: Handle errors
            const result = await scrapeBrowserAgentData();
            setData(result);
        };

        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Table
                items={data}
                selectionType={Table.SELECTION_TYPE.SINGLE}
                selected={({ index }) => index === this.state.selectedRow}
                onSelect={(evt, { index }) => {
                    this.setState((prevState) => {
                        const { selectedRow } = prevState;

                        // When the selected row is clicked, set value to `null`
                        return { selectedRow: selectedRow === index ? null : index };
                    });
                }}
            >
                <TableHeader>
                    <TableHeaderCell value={({ item }) => item.version}>Version</TableHeaderCell>
                    <TableHeaderCell value={({ item }) => item.startDate}>Start Date</TableHeaderCell>
                    <TableHeaderCell value={({ item }) => item.endDate}>End Date</TableHeaderCell>
                </TableHeader>

                {({ item }) => (
                    <TableRow>
                        <TableRowCell>{item.version}</TableRowCell>
                        <TableRowCell>
                            {item.startDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </TableRowCell>
                        <TableRowCell>
                            {item.endDate.toLocaleDateString('en-US', {
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
