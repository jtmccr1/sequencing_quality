import React, { Component } from 'react';
import { css } from 'glamor';
import logo from '../images/hive_logo.jpeg';
import '../styles/App.css';
import { getData } from '../utils/getData';
import Summary from './Summary';
import { channelColours } from '../utils/commonStyles';
import VariantTable from './VariantTable';
import { parseVariantData, parseCoverageData, parseGenomeAnnotation } from '../utils/parseData';
import * as _ from 'lodash';
const panelContainer = css({
	width: 'calc(100% - 30px)',
	height: '350px' /* adjusting these will also adjust the graphs */,
	minHeight: '350px',
	margin: '10px 10px 10px 10px',
});

const startingSamples = [
	{
		run: 'HK_1',
		sample: 'HS1345_B',
	},
	{
		run: 'HK_1',
		sample: 'HS1341_B',
	},
	{
		run: 'HK_1',
		sample: 'HS1357_B',
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
				const newVariantData = this.state.variantData.forEach(sample => {
					sample.data = sample.data.filter(
						pos => pos.chr === ops.seg && pos.pos >= ops.pos[0] && pos.pos <= ops.pos[1]
					);
				});
				const newCoverageData = this.state.coverageData.forEach(sample => {
					sample.data = sample.data.filter(
						pos => pos.chr === ops.seg && pos.pos >= ops.pos[0] && pos.pos <= ops.pos[1]
					);
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
			getData(`${sample.run}/${sample.sample}.removed.filtered.json`, this.addData);
		}
	}

	componentDidMount() {
		getData('/or.bed.json', this.addGenome);
		//getData('requestCoverageData', this.addData);
		this.addSampleData();
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
			</div>
		);
	}
}

export default App;
