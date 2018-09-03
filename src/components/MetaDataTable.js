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
		this.onSelectAll = this.onSelectAll.bind(this);
		this.onRowSelect = this.onRowSelect.bind(this);
		this.state = {
			selected: [],
		};
	}
	onRowSelect({ SPECID }, isSelected) {
		if (isSelected) {
			this.setState({
				selected: [...this.state.selected, SPECID],
			});
		} else {
			this.setState({ selected: this.state.selected.filter(it => it !== SPECID) });
		}
		return false;
	}

	onSelectAll(isSelected) {
		if (!isSelected) {
			this.setState({ selected: [] });
		}
		return false;
	}

	render() {
		const selectRowProp = {
			mode: 'checkbox',
			clickToSelect: true,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
			selected: this.state.selected,
		};

		const options = {
			sortName: 'ENROLLID',
			sortOrder: 'desc',
		};

		return (
			<div>
				<h2>Samples to analyze</h2>
				<BootstrapTable
					data={this.props.data}
					striped
					hover
					condensed
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
