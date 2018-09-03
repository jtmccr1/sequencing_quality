import React from 'react';
import { select } from 'd3-selection';
import { drawGenomeAnnotation, drawAxes, calcScales } from '../utils/commonFunctions';
import { chartTitleCSS } from '../utils/commonStyles';

export const drawVariants = (svg, chartGeom, scales, data, colours) => {
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
			return scales.x(d.freqRaw[0]);
		})
		.attr('cy', function(d) {
			return scales.y(d.freqRaw[1]);
		})
		.attr('r', 2)
		.attr('fill', d => colours[samples.indexOf(d.Sample) % colours.length]);
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

class TechnicalPlot extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chartGeom: {} };
		this.drawPlot = this.drawPlot.bind(this);
		this.setGeom = this.setGeom.bind(this);
	}
	drawPlot() {
		const node = this.node;
		let extremes = {
			freq: [0.001, 0.5],
		};
		const svg = select(node);
		const dimensions =
			Object.keys(this.state.chartGeom).length > 0
				? this.state
				: { chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()) };

		const scales = calcScales(dimensions.chartGeom, extremes, 'freq', 'freq', ['logY', 'logX']);
		drawAxes(svg, dimensions.chartGeom, scales);
		const technicalReplicates = this.props.variantData.filter(x => x.Sample[0] !== x.Sample[1]);
		drawVariants(svg, dimensions.chartGeom, scales, technicalReplicates, this.props.colours);
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

export default TechnicalPlot;
