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
class MetaDataTable extends Component {
	render() {
		return (
			<div>
				<BootstrapTable data={this.props.data} selectRow={selectRowProp}>
					<TableHeaderColumn isKey dataField="SPECID">
						Specimen
					</TableHeaderColumn>
					<TableHeaderColumn dataField="ENROLLID">Enrollee</TableHeaderColumn>
					<TableHeaderColumn dataField="HOUSE_ID">House</TableHeaderColumn>
					<TableHeaderColumn dataField="onset">Date of Symptom Onset</TableHeaderColumn>
					<TableHeaderColumn dataField="collect">Date of Collection</TableHeaderColumn>
					<TableHeaderColumn dataField="DPI">Days post onset</TableHeaderColumn>
					<TableHeaderColumn dataField="gc_ul">Titer (gc/ul)</TableHeaderColumn>
					<TableHeaderColumn dataField="vaccination">Vaccination Status</TableHeaderColumn>
				</BootstrapTable>
			</div>
		);
	}
}

export default MetaDataTable;
