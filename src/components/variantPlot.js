import React from 'react';
import { select } from 'd3-selection';
import { calcScalesYlog, drawAxes, calcScales } from '../utils/commonFunctions';
import { chartTitleCSS } from '../utils/commonStyles';

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
	svg.selectAll('.cirlce').remove();
	try {
		svg.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', function(d) {
				return scales.x(d.concat_pos);
			})
			.attr('cy', function(d) {
				return scales.y(d.freq);
			})
			.attr('r', 2)
			.attr('fill', d => colours[samples.indexOf(d.Sample)]);
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

class VariantPlot extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chartGeom: {} };
	}
	componentDidMount() {
		const newState = {
			SVG: select(this.DOMref),
			chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()),
		};

		newState.scales = calcScales(newState.chartGeom, this.props.variantData, 'concat_pos', 'freq', ['logY']);
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

export default VariantPlot;
