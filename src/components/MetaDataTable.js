import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import { css } from 'glamor';

const style = css({ margin: '10px 250px 100px 250px' });

const textColumn = {
	dataAlign: 'left',
	headerAlign: 'left',
	filter: { type: 'TextFilter', delay: 500 },
};
const numberColumn = {
	dataAlign: 'center',
	headerAlign: 'center',
};

class MetaDataTable extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const selectRowProp = {
			mode: 'checkbox',
			clickToSelect: true,
			onSelect: this.props.onRowSelect,
			onSelectAll: this.props.onSelectAll,
			selected: this.props.selected,
			bgColor: (row, isSelect) => {
				if (isSelect) {
					const color = this.props.colors[this.props.selected.indexOf(row.SPECID) % this.props.colors.length];
					return color;
				}
				return null;
			},
		};

		const options = {
			sortName: 'ENROLLID',
			sortOrder: 'desc',
		};

		return (
			<div {...style}>
				<h2>Samples to analyze</h2>
				<BootstrapTable
					data={this.props.data}
					striped
					hover
					condensed
					pagination
					selectRow={selectRowProp}
					options={options}
				>
					<TableHeaderColumn isKey dataField="SPECID" dataSort width="100" {...textColumn}>
						Specimen
					</TableHeaderColumn>
					<TableHeaderColumn dataField="ENROLLID" dataSort width="80" {...textColumn}>
						Enrollee
					</TableHeaderColumn>
					<TableHeaderColumn dataField="HOUSE_ID" dataSort width="80" {...textColumn}>
						House
					</TableHeaderColumn>
					<TableHeaderColumn dataField="onset" dataSort width="120" {...numberColumn}>
						Date of Symptom Onset
					</TableHeaderColumn>
					<TableHeaderColumn dataField="collect" dataSort width="120" {...numberColumn}>
						Date of Collection
					</TableHeaderColumn>
					<TableHeaderColumn
						dataField="DPI"
						dataSort
						width="120"
						{...{ ...numberColumn, filter: { type: 'TextFilter', delay: 500 } }}
					>
						Days post onset
					</TableHeaderColumn>
					<TableHeaderColumn dataField="gc_ul" dataSort width="120" {...numberColumn}>
						Titer (gc/ul)
					</TableHeaderColumn>
					<TableHeaderColumn
						dataField="vaccination_status"
						dataSort
						width="150"
						{...{ ...numberColumn, filter: { type: 'TextFilter', delay: 500 } }}
					>
						Vaccination Status
					</TableHeaderColumn>
				</BootstrapTable>
			</div>
		);
	}
}

export default MetaDataTable;
