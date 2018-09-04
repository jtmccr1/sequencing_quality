import React from 'react';
import * as R from 'ramda';
import { chartTitleCSS } from '../utils/commonStyles';
import { select } from 'd3-selection';
import { drawAxes, calcScales } from '../utils/commonFunctions';
const concatAll = R.curry(R.reduce(R.concat, []));

const onlySynonymous = allele => {
	const x = R.pipe(
		R.map(R.propEq('classification', 'Synonymous')),
		R.all(R.equals(true))
	)(allele.mutationalClass);
	return x;
};

const byType = list => {};
const processData = (metaData, variantData) => {
	// get sites that only have 1 consensus
	const synonymous = R.compose(
		concatAll(),
		R.map(R.prop('data')),
		R.filter(onlySynonymous)
	)(variantData);
	// filter to synonymous mutations only
};

export const drawRates = (svg, chartGeom, scales, data, colours) => {
	/* data is array of channelData */
	/* https://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js */

	// .curve(curveCatmullRom.alpha(0.3));
	let samples = [];
	data.forEach(element => {
		if (samples.indexOf(element.Sample) === -1) {
			samples.push(element.Sample);
		}
	});
	let dataArray = [];
	data.forEach(element => {
		dataArray.push(...element.data);
	});

	svg.selectAll('circle').remove();

	svg.selectAll('circle')
		.data(dataArray)
		.enter()
		.append('circle');

	svg.selectAll('circle')
		.attr('cx', function(d) {
			return scales.x(d.concat_pos);
		})
		.attr('cy', function(d) {
			return scales.y(d.freq);
		})
		.attr('r', 2)
		.attr('fill', d => colours[samples.indexOf(d.Sample) % colours.length]);
};
const calcChartGeom = DOMRect => ({
	width: DOMRect.width,
	height: DOMRect.height - 20, // title line
	spaceLeft: 40,
	spaceRight: 10,
	spaceBottom: 60,
	spaceTop: 10,
});

class MutationsOverTime extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chartGeom: {} };
		this.drawPlot = this.drawPlot.bind(this);
		this.setGeom = this.setGeom.bind(this);
	}
	drawPlot() {
		const node = this.node;
		let extremes = {
			DPI: [],
			freq: [],
		};

		const processedData = processData(this.props.metaData, this.props.variantData);

		// this.props.variantData.forEach(sample => {
		// 	extremes.concat_pos.push(...sample.extremes.concat_pos);
		// 	extremes.freq.push(...sample.extremes.freq);
		// });
		// const svg = select(node);
		// const dimensions =
		// 	Object.keys(this.state.chartGeom).length > 0
		// 		? this.state
		// 		: { chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()) };

		// const scales = calcScales(dimensions.chartGeom, extremes, 'DPI', 'freq', ['logY']);
		// drawAxes(svg, dimensions.chartGeom, scales);
		// drawVariants(svg, dimensions.chartGeom, scales, this.props.variantData, this.props.colours);
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
			<div>
				<h2>Look at these mutations overtime</h2>
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
			</div>
		);
	}
}

export default MutationsOverTime;
