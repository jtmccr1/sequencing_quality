import React from 'react';
import { select } from 'd3-selection';
import { calcScales, drawAxes } from '../utils/commonFunctions';
import { chartTitleCSS } from '../utils/commonStyles';
import { line, curveStep, curveLinear } from 'd3-shape';
const cdf = require('cumulative-distribution-function');

export const drawCurve = (svg, chartGeom, scales, data, colours) => {
	/* data is array of channelData */
	/* https://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js */

	// .curve(curveCatmullRom.alpha(0.3));
	var samples = [];
	data.forEach(element => {
		if (samples.indexOf(element.Sample) === -1) {
			samples.push(element.Sample);
		}
	});
	//make an arrary of arrays of frequencies
	var sampleFrequencies = [];
	samples.forEach(sample => {
		var sampleDataPoint = [];
		data.forEach(element => {
			if (element.Sample === sample) {
				sampleDataPoint.push(element.freq);
			}
		});
		sampleFrequencies.push(sampleDataPoint);
	});

	//make a cdf function for each sample arrary and add {cdf: freq:} object for each point for each sample
	var samplesCdfData = [];
	for (var i = 0; i < sampleFrequencies.length; i++) {
		var sample = sampleFrequencies[i];
		var samplecdf = cdf(sample);
		var sampleCdfValues = [];
		for (var j = 0; j < sample.length; j++) {
			sampleCdfValues.push({ cdf: samplecdf(sample[j]), freq: sample[j] });
		}
		sampleCdfValues.sort(function(a, b) {
			return a.freq > b.freq ? 1 : b.freq > a.freq ? -1 : 0;
		});
		samplesCdfData.push(sampleCdfValues);
	}
	//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript

	const makeLinePath = line()
		.x(d => scales.x(d.freq))
		.y(d => scales.y(d.cdf))
		.curve(curveLinear);
	// .curve(curveCatmullRom.alpha(0.3));

	svg.selectAll('.line').remove();
	try {
		console.log(samplesCdfData);
		svg.selectAll('.line')
			.data(samplesCdfData)
			.enter()
			.append('path')
			.attr('class', 'line')
			.attr('fill', 'none')
			.attr('stroke', (d, i) => colours[i])
			.attr('d', makeLinePath);
	} catch (err) {
		console.log('d3 spark lines error', err);
	}
};

/* given the DOM dimensions of the chart container, calculate the chart geometry (used by the SVG & D3) */
const calcChartGeom = DOMRect => ({
	width: DOMRect.width,
	height: DOMRect.height - 20, // title line
	spaceLeft: 40,
	spaceRight: 10,
	spaceBottom: 60,
	spaceTop: 10,
});

class CummulativeDistribution extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chartGeom: {} };
	}
	componentDidMount() {
		const newState = {
			SVG: select(this.DOMref),
			chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()),
		};
		newState.scales = calcScales(newState.chartGeom, 1, 1);
		drawAxes(newState.SVG, newState.chartGeom, newState.scales);
		drawCurve(newState.SVG, newState.chartGeom, newState.scales, this.props.variantData, this.props.colours);
		this.setState(newState);
	}

	render() {
		return (
			<div
				style={{ ...this.props.style }}
				ref={r => {
					this.boundingDOMref = r;
				}}
			>
				<div {...chartTitleCSS}>{this.props.title}</div>
				<svg
					ref={r => {
						this.DOMref = r;
					}}
					height={this.state.chartGeom.height || 0}
					width={this.state.chartGeom.width || 0}
				/>
			</div>
		);
	}
}

export default CummulativeDistribution;
