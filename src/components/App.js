import React, { Component } from 'react';
import { css } from 'glamor';
import logo from '../images/logo.svg';
import '../styles/App.css';
import { getData } from '../utils/getData';
import CoveragePlot from './coveragePlot';
import { channelColours } from '../utils/commonStyles';

const panelContainer = css({
	width: 'calc(100% - 30px)',
	height: '350px' /* adjusting these will also adjust the graphs */,
	minHeight: '350px',
	margin: '10px 10px 10px 10px',
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			genomeAnnotation: [],
			variantData: [],
			coverageData: [
				[
					{
						Sample: 'test_sample',
						chr: 'PA',
						concat_pos: 4708,
						consensus: 'A',
						coverage: 981,
						pos: 24,
					},
					{
						Sample: 'test_sample',
						chr: 'PA',
						concat_pos: 4800,
						consensus: 'A',
						coverage: 981,
						pos: 24,
					},
					{
						Sample: 'test_sample',
						chr: 'PA',
						concat_pos: 4900,
						consensus: 'A',
						coverage: 981,
						pos: 24,
					},
				],
				[
					{
						Sample: 'test_sample',
						chr: 'PA',
						concat_pos: 4708,
						consensus: 'A',
						coverage: 200,
						pos: 24,
					},
					{
						Sample: 'test_sample',
						chr: 'PA',
						concat_pos: 4800,
						consensus: 'A',
						coverage: 400,
						pos: 24,
					},
					{
						Sample: 'test_sample',
						chr: 'PA',
						concat_pos: 4900,
						consensus: 'A',
						coverage: 300,
						pos: 24,
					},
				],
			],
		};
		this.addData = newData => {
			this.setState(this.calcNewState(newData));
		};
	}

	calcNewState(newData) {
		console.time('calcNewState');
		const newState = {};
		if (!this.state.data) {
			/* must initialise! */
			newState.data = newData;
			newState.genomeAnnotation = newData.genomeAnnotation;
			newState.variantData = newData.variantData;
			newState.coverageData = newData.coverageData;
		} else {
			/* a data update */
			newState.data = this.state.data.concat(newData);
			newState.genomeAnnotation = newData.genomeAnnotation;
			newState.variantData = newData.variantData;
			newState.coverageData = newData.coverageData;
		}
		console.timeEnd('calcNewState');
		return newState;
	}

	// componentDidMount() {
	// 	getData('requestGenomeAnnotation', this.addData);
	// }

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<div {...panelContainer}>
					<CoveragePlot
						style={{ width: '35%', margin: 'auto', height: '100%' }}
						title={'Coverage'}
						coverageData={this.state.coverageData}
						colours={channelColours}
					/>
				</div>
			</div>
		);
	}
}

export default App;
