import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import { getData } from '../utils/getData';

class App extends Component {
	constructor(props) {
		super(props);
		this.addGenome = data => {
			console.log(data);
		};
		this.addVariants = data => {
			console.log(data);
		};
		this.addCoverage = data => {
			console.log(data);
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
