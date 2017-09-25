import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table, SortDirection, SortIndicator } from 'react-virtualized';
import { Table, Column, Cell } from 'fixed-data-table-2';

const data = [
  { name: 'a1', id: 'b1', dps: 'c1' },
  { name: 'a2', id: 'b2', dps: 'c2' },
  { name: 'a3', id: 'b3', dps: 'c3' },
];

export default function TrinketTable(props) {
  return (
    <AutoSizer>
      {({ width, height }) => (
        <Table
          ref="Table"
          headerHeight={headerHeight}
          height={height}
          overscanRowCount={10}
          rowHeight={30}
          rowCount={data.length}
          rowGetter={({ index }) => data[index]}
        />
      )}
    </AutoSizer>
  )
}

TrinketTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
