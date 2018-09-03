import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';

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
		this.onSelectRow = this.onSelectRow.bind(this);
		this.options = {
			defaultSortName: 'ENROLLID', // default sort column name
			defaultSortOrder: 'desc', // default sort order
		};
		this.selectRowProp = {
			mode: 'checkbox',
			clickToSelect: true,
			unselectable: [2],
			selected: [1],
			onSelect: this.onSelectRow,
			bgColor: 'gold',
		};
	}
	onSelectRow(row, isSelected, e) {
		if (isSelected) {
			this.props.selectorFunction(row);
		}
	}

	render() {
		return (
			<div>
				<h2>Samples to analyze</h2>
				<BootstrapTable
					data={this.props.data}
					striped
					hover
					condensed
					selectRow={this.selectRowProp}
					options={this.options}
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
					<TableHeaderColumn dataField="DPI" dataSort width="120" {...numberColumn}>
						Days post onset
					</TableHeaderColumn>
					<TableHeaderColumn dataField="gc_ul" dataSort width="120" {...numberColumn}>
						Titer (gc/ul)
					</TableHeaderColumn>
					<TableHeaderColumn dataField="vaccination_status" dataSort width="150" {...numberColumn}>
						Vaccination Status
					</TableHeaderColumn>
				</BootstrapTable>
			</div>
		);
	}
}

export default MetaDataTable;
