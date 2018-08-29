import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';

function onSelectRow(row, isSelected, e) {
	// if (isSelected) {
	// 	alert(`You just selected '${row['name']}'`);
	// }
}

const selectRowProp = {
	mode: 'checkbox',
	clickToSelect: true,
	unselectable: [2],
	selected: [1],
	onSelect: onSelectRow,
	bgColor: 'gold',
};
const textColumn = {
	dataAlign: 'left',
	headerAlign: 'left',
};
const numberColumn = {
	dataAlign: 'center',
	headerAlign: 'center',
};
class MetaDataTable extends Component {
	render() {
		return (
			<div>
				<BootstrapTable data={this.props.data} selectRow={selectRowProp}>
					<TableHeaderColumn isKey dataField="SPECID" {...textColumn}>
						Specimen
					</TableHeaderColumn>
					<TableHeaderColumn dataField="ENROLLID" {...textColumn}>
						Enrollee
					</TableHeaderColumn>
					<TableHeaderColumn dataField="HOUSE_ID" {...textColumn}>
						House
					</TableHeaderColumn>
					<TableHeaderColumn dataField="onset" {...numberColumn}>
						Date of Symptom Onset
					</TableHeaderColumn>
					<TableHeaderColumn dataField="collect" {...numberColumn}>
						Date of Collection
					</TableHeaderColumn>
					<TableHeaderColumn dataField="DPI" {...numberColumn}>
						Days post onset
					</TableHeaderColumn>
					<TableHeaderColumn dataField="gc_ul" {...numberColumn}>
						Titer (gc/ul)
					</TableHeaderColumn>
					<TableHeaderColumn dataField="vaccination_status" {...textColumn}>
						Vaccination Status
					</TableHeaderColumn>
				</BootstrapTable>
			</div>
		);
	}
}

export default MetaDataTable;
