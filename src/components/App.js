import React, { Component } from 'react';

import logo from '../images/hive_logo.jpeg';
import '../styles/App.css';
import { getData } from '../utils/getData';
import Summary from './Summary';
import MetaDataTable from './MetaDataTable';
import FrequencyAndSegmentSelection from './FrequencyAndSegmentSelection';
import Figures from './Figures';
import { parseVariantData, parseCoverageData, parseGenomeAnnotation } from '../utils/parseData';
import * as _ from 'lodash';
import { channelColours } from '../utils/commonStyles';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: false,
			coverageData: [],
			genomeAnnotation: [],
			variantData: [],
			selectedPositions: '',
			metaData: '',
			selected: ['HS1391'],
		};
		this.addData = newData => {
			this.setState(this.calcNewState(newData));
		};
		this.filterPosition = this.filterPosition.bind(this);
		this.updateVariantData = this.updateVariantData.bind(this);
		this.updateDisplay = this.updateDisplay.bind(this);
		this.onSelectAll = this.onSelectAll.bind(this);
		this.onRowSelect = this.onRowSelect.bind(this);

		this.addGenome = newData => {
			let newState = this.state;
			newState['genomeAnnotation'] = parseGenomeAnnotation(newData);
			this.setState(newState);
		};
		this.addMetaData = newData => {
			let newState = this.state;
			newState['metaData'] = newData;
			this.setState(newState);
		};
	}

	calcNewState(newData, key) {
		console.time('calcNewState');
		let newState = this.state;
		if (!this.state.data) {
			/* must initialise! */
			newState['variantData'].push(parseVariantData(newData));
			newState['coverageData'].push(parseCoverageData(newData));
			newState.data = true;
		} else {
			/* a data update */
			newState.data = true;
			newState['variantData'].push(parseVariantData(newData));
			newState['coverageData'].push(parseCoverageData(newData));
		}
		console.timeEnd('calcNewState');
		return newState;
	}
	updateDisplay(text) {
		this.setState({ selectedPositions: text });
	}

	filterPosition(ops) {
		console.log(ops);
		if (ops.seg === '') {
			//if no segment then reset and load all the data

			this.setState({ variantData: [], coverageData: [] }, this.updateVariantData());
		} else {
			// If no position data
			if (!ops.pos) {
				let newVariantData = this.state.variantData.slice();
				newVariantData.forEach(sample => {
					sample.data = sample.data.filter(pos => pos.chr === ops.seg);
					sample.extremes = {
						freq: [_.minBy(sample.data, a => a.freq).freq, _.maxBy(sample.data, a => a.freq).freq],
						concat_pos: [
							_.minBy(sample.data, a => a.concat_pos).concat_pos,
							_.maxBy(sample.data, a => a.concat_pos).concat_pos,
						],
					};
					return sample;
				});
				let newCoverageData = this.state.coverageData.slice();
				newCoverageData.forEach(sample => {
					sample.data = sample.data.filter(pos => pos.chr === ops.seg);
					sample.extremes = {
						coverage: [
							_.minBy(sample.data, a => a.coverage).coverage,
							_.maxBy(sample.data, a => a.coverage).coverage,
						],
						concat_pos: [
							_.minBy(sample.data, a => a.concat_pos).concat_pos,
							_.maxBy(sample.data, a => a.concat_pos).concat_pos,
						],
					};
					return sample;
				});
				this.setState({
					variantData: newVariantData,
					coverageData: newCoverageData,
				});
			} else {
				let newVariantData = this.state.variantData.slice();
				newVariantData.forEach(sample => {
					sample.data = sample.data.filter(
						pos => pos.chr === ops.seg && pos.pos >= ops.pos[0] && pos.pos <= ops.pos[1]
					);
					sample.extremes = {
						freq: [_.minBy(sample.data, a => a.freq).freq, _.maxBy(sample.data, a => a.freq).freq],
						concat_pos: [
							_.minBy(sample.data, a => a.concat_pos).concat_pos,
							_.maxBy(sample.data, a => a.concat_pos).concat_pos,
						],
					};
					return sample;
				});
				let newCoverageData = this.state.coverageData.slice();
				newCoverageData.forEach(sample => {
					sample.data = sample.data.filter(
						pos => pos.chr === ops.seg && pos.pos >= ops.pos[0] && pos.pos <= ops.pos[1]
					);
					sample.extremes = {
						coverage: [
							_.minBy(sample.data, a => a.coverage).coverage,
							_.maxBy(sample.data, a => a.coverage).coverage,
						],
						concat_pos: [
							_.minBy(sample.data, a => a.concat_pos).concat_pos,
							_.maxBy(sample.data, a => a.concat_pos).concat_pos,
						],
					};
					return sample;
				});
				this.setState({
					variantData: newVariantData,
					coverageData: newCoverageData,
				});
			}
		}
	}
	updateVariantData() {
		const currentSamples = this.state.variantData.map(x => x.Sample[0].split('_')[0]);
		// Add the new samples
		const newSPECID = this.state.selected.filter(x => currentSamples.indexOf(x) === -1);
		console;
		const that = this;
		async function addNew(newSPECID) {
			console.log('here');
			for (const SPECID of newSPECID) {
				await getData(`processedSNV/${SPECID}.processed.json`, that.addData);
			}
			// wait until everything is updated then remove the deselected ones

			const updatedVariants = that.state.variantData.filter(x => {
				const SPECID = x.Sample[0].split('_')[0];
				return that.state.selected.indexOf(SPECID) > -1;
			});
			const updatedCoverage = that.state.coverageData.filter(x => {
				const SPECID = x.Sample[0].split('_')[0];
				return that.state.selected.indexOf(SPECID) > -1;
			});
			if (updatedVariants.length !== that.state.variantData.length) {
				that.setState({
					variantData: updatedVariants,
					coverageData: updatedCoverage,
				});
			}
		}
		addNew(newSPECID);
	}
	// ############ -- Table functions -- #####################
	onRowSelect({ SPECID }, isSelected) {
		if (isSelected) {
			console.log(this.state.selected);
			this.setState(
				{
					selected: [...this.state.selected, SPECID],
				},
				() => {
					this.updateVariantData();
				}
			);
		} else {
			this.setState({ selected: this.state.selected.filter(it => it !== SPECID) }, () => {
				this.updateVariantData();
			});
		}
	}

	onSelectAll(isSelected, rows) {
		if (!isSelected) {
			this.setState({ selected: [] }, () => {
				this.updateVariantData();
			});
		} else {
			this.setState({ selected: rows.map(x => x.SPECID) }, () => {
				this.updateVariantData();
			});
		}

		return false;
	}

	componentDidMount() {
		getData('NY.OR.json', this.addGenome);
		//getData('requestCoverageData', this.addData);
		this.updateVariantData();
		getData('SampleMetaData.json', this.addMetaData);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">2014-2015 HIVE overview</h1>
				</header>

				{this.state.data ? (
					<div>
						<Summary
							filterPosition={this.filterPosition}
							selectedPositions={this.state.selectedPositions}
							coverageData={this.state.coverageData}
							genomeAnnotation={this.state.genomeAnnotation}
							variantData={this.state.variantData}
							updateDisplay={this.updateDisplay}
						/>
					</div>
				) : (
					<div>
						<h1>Loading data</h1>
						<div className="loader" />
					</div>
				)}
				<div align="left">
					<FrequencyAndSegmentSelection
						style={{ width: '25%', margin: 'auto', height: '100%' }}
						title={'Filter data'}
						selectedPositions={this.state.selectedPositions}
						filterPosition={this.filterPosition}
						updateDisplay={this.updateDisplay}
					/>
				</div>
				<div>
					<MetaDataTable
						data={this.state.metaData}
						selected={this.state.selected}
						onRowSelect={this.onRowSelect}
						onSelectAll={this.onSelectAll}
						colors={channelColours}
					/>
				</div>
				{/*<div>
					<Figures metaData={this.state.metaData} variantData={this.state.variantData} />
				</div> */}
			</div>
		);
	}
}

export default App;
