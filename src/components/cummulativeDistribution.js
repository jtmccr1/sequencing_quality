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

	//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
	let dataArray = [];
	data.forEach(sample => {
		const sampleCDF = cdf(sample.data.map(d => d.freq));
		sample.data.forEach(allele => (allele.cdf = sampleCDF(allele.freq)));
		sample.data.sort(function(a, b) {
			return a.freq > b.freq ? 1 : b.freq > a.freq ? -1 : 0;
		});
		dataArray.push(sample.data);
	});

	const makeLinePath = line()
		.x(d => scales.x(d.freq))
		.y(d => scales.y(d.cdf))
		.curve(curveLinear);
	// .curve(curveCatmullRom.alpha(0.3));

	svg.selectAll('path').remove();

	svg.selectAll('path')
		.data(dataArray)
		.enter()
		.append('path');
	svg.selectAll('path')
		.attr('class', 'line')
		.attr('fill', 'none')
		.attr('stroke', (d, i) => colours[i % colours.length])
		.attr('d', makeLinePath);
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
		this.drawPlot = this.drawPlot.bind(this);
		this.setGeom = this.setGeom.bind(this);
	}
	drawPlot() {
		const node = this.node;
		let extremes = {
			freq: [],
			cdf: [0, 1],
		};
		this.props.variantData.forEach(sample => {
			extremes.freq.push(...sample.extremes.freq);
		});
		const svg = select(node);
		const dimensions =
			Object.keys(this.state.chartGeom).length > 0
				? this.state
				: { chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()) };

		const scales = calcScales(dimensions.chartGeom, extremes, 'freq', 'cdf', ['logX']);
		drawAxes(svg, dimensions.chartGeom, scales);
		drawCurve(svg, dimensions.chartGeom, scales, this.props.variantData, this.props.colours);
	}
	setGeom() {
		this.setState({ chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()) });
	}
	componentDidMount() {
		this.setGeom();
		this.drawPlot();
	}
	componentDidUpdate() {
		this.drawPlot();
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
					ref={node => (this.node = node)}
					height={this.state.chartGeom.height || 0}
					width={this.state.chartGeom.width || 0}
				/>
			</div>
		);
	}
}

export default CummulativeDistribution;
