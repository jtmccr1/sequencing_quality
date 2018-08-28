import React, { Component } from 'react';
import { css } from 'glamor';
import logo from '../images/hive_logo.jpeg';
import '../styles/App.css';
import { getData } from '../utils/getData';
import Summary from './Summary';
import { channelColours } from '../utils/commonStyles';
import VariantTable from './VariantTable';
import { parseVariantData, parseCoverageData, parseGenomeAnnotation } from '../utils/parseData';
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
		};
		this.addData = newData => {
			this.setState(this.calcNewState(newData));
		};
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
	componentDidMount() {
		getData('/or.bed.json', this.addGenome);
		//getData('requestCoverageData', this.addData);
		for (const sample of this.state.samples) {
			getData(`${sample.run}/${sample.sample}.removed.filtered.json`, this.addData);
		}
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
							coverageData={this.state.coverageData}
							genomeAnnotation={this.state.genomeAnnotation}
							variantData={this.state.variantData}
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
