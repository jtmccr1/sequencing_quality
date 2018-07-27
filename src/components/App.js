import React, { Component } from 'react';
import { css } from 'glamor';
import logo from '../images/logo.svg';
import '../styles/App.css';
import { getData } from '../utils/getData';
import Summary from './Summary';
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
			data: false,
			coverageData: [],
			genomeAnnotation: [],
			variantData: [],
		};
		this.addData = (newData, route) => {
			this.setState(this.calcNewState(newData, route));
		};
	}

	calcNewState(newData, route) {
		console.time('calcNewState');
		var newState = this.state;
		if (!this.state.data) {
			/* must initialise! */

			if (route === 'requestCoverageData') {
				newState.coverageData = newData;
			} else if (route === 'requestGenomeAnnotation') {
				newState.genomeAnnotation = newData;
			} else if (route === 'requestVariantData') {
				newState.variantData = newData;
			}

			if (
				(newState.variantData.length > 0) &
				(newState.coverageData.length > 0) &
				(newState.genomeAnnotation.length > 0)
			) {
				newState.data = true;
			}
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
		getData('requestGenomeAnnotation', this.addData);
		getData('requestCoverageData', this.addData);
		getData('requestVariantData', this.addData);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
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
					<h1>Loading data</h1>
				)}
			</div>
		);
	}
}

export default App;
