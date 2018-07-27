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
		this.state = { data: false };
		this.addData = newData => {
			this.setState(this.calcNewState(newData));
		};
	}

	calcNewState(newData) {
		console.time('calcNewState');
		const newState = {};
		if (!this.state.data) {
			/* must initialise! */
			newState.data = true;
			newState.coverageData = newData;
		} else {
			/* a data update */
			newState.data = true;
			newState.coverageData = newData;
		}
		console.timeEnd('calcNewState');
		console.log(newState);
		return newState;
	}
	componentDidMount() {
		//getData('requestGenomeAnnotation', this.addGenome);
		getData('requestCoverageData', this.addData);
		//getData('requestVariantData', this.addVariants);
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
				{this.state.data ? (
					<div {...panelContainer}>
						<CoveragePlot
							style={{ width: '35%', margin: 'auto', height: '100%' }}
							title={'Coverage'}
							coverageData={this.state.coverageData}
							colours={channelColours}
						/>
					</div>
				) : (
					<h1>Loading data</h1>
				)}
			</div>
		);
	}
}

export default App;
