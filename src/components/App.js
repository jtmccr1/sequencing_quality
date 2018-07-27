import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import { getData } from '../utils/getData';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			genomeAnnotation: [],
			variantData: [],
			coverageData: [],
		};
		this.addGenome = data => {
			const variantData = this.state.variantData;
			const coverageData = this.state.coverageData;
			const newState = {
				genomeAnnotation: data,
				variantData: variantData,
				coverageData: coverageData,
			};
			this.setState(newState);
		};

		this.addVariants = data => {
			const genomeAnnotation = this.state.genomeAnnotation;
			const coverageData = this.state.coverageData;
			const newState = {
				genomeAnnotation: genomeAnnotation,
				variantData: data,
				coverageData: coverageData,
			};
			this.setState(newState);
		};

		this.addCoverage = data => {
			const genomeAnnotation = this.state.genomeAnnotation;
			const variantData = this.state.variantData;
			const newState = {
				genomeAnnotation: genomeAnnotation,
				variantData: variantData,
				coverageData: data,
			};
			this.setState(newState);
		};
	}

	componentDidMount() {
		getData('requestGenomeAnnotation', this.addGenome);
		getData('requestCoverageData', this.addCoverage);
		getData('requestVariantData', this.addVariants);
	}

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
			</div>
		);
	}
}

export default App;
