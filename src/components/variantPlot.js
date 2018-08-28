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
		if (samples.indexOf(element.sample) === -1) {
			samples.push(element.sample);
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
		.attr('fill', d => colours[samples.indexOf(d.sample) % colours.length]);
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

class VariantPlot extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chartGeom: {} };
		this.drawPlot = this.drawPlot.bind(this);
		this.setGeom = this.setGeom.bind(this);
	}
	drawPlot() {
		const node = this.node;
		let extremes = {
			concat_pos: [],
			freq: [],
		};
		this.props.variantData.forEach(sample => {
			extremes.concat_pos.push(...sample.extremes.concat_pos);
			extremes.freq.push(...sample.extremes.freq);
		});
		const svg = select(node);
		const dimensions =
			Object.keys(this.state.chartGeom).length > 0
				? this.state
				: { chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()) };

		const scales = calcScales(dimensions.chartGeom, extremes, 'concat_pos', 'freq', ['logY']);
		drawAxes(svg, dimensions.chartGeom, scales);
		drawVariants(svg, dimensions.chartGeom, scales, this.props.variantData, this.props.colours);

		drawGenomeAnnotation(svg, dimensions.chartGeom, scales, this.props.genomeAnnotation);
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

export default VariantPlot;
