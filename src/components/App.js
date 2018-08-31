import React, { Component } from 'react';

import logo from '../images/hive_logo.jpeg';
import '../styles/App.css';
import { getData } from '../utils/getData';
import Summary from './Summary';
import MetaDataTable from './MetaDataTable';
import { parseVariantData, parseCoverageData, parseGenomeAnnotation } from '../utils/parseData';
import * as _ from 'lodash';
import { timingSafeEqual } from 'crypto';

const startingSamples = [
	{
		run: 'HK_8',
		sample: 'PC1A',
	},
	{
		run: 'HK_8',
		sample: 'PC1B',
	},
	{
		run: 'HK_8',
		sample: 'PC2A',
	},
];

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: false,
			coverageData: [],
			genomeAnnotation: [],
			variantData: [],
			samples: startingSamples,
			selectedPositions: '',
			metaData: '',
		};
		this.addData = newData => {
			this.setState(this.calcNewState(newData));
		};
		this.filterPosition = this.filterPosition.bind(this);
		this.addSampleData = this.addSampleData.bind(this);
		this.updateDisplay = this.updateDisplay.bind(this);
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
			this.addSampleData();
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
	addSampleData() {
		this.setState({ variantData: [], coverageData: [] });
		for (const sample of this.state.samples) {
			getData(`${sample.run}/${sample.sample}.removed.flattened.filtered.json`, this.addData);
		}
	}

	componentDidMount() {
		getData('/NY.OR.json', this.addGenome);
		//getData('requestCoverageData', this.addData);
		this.addSampleData();
		getData('/SampleMetaData.json', this.addMetaData);
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
				<div>
					<MetaDataTable data={this.state.metaData} />
				</div>
			</div>
		);
	}
}

export default App;
