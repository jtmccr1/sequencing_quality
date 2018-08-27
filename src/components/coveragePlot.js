import React from 'react';
import { select } from 'd3-selection';
import { line, curveStep, curveLinear } from 'd3-shape';
import { calcScales, drawAxes, drawGenomeAnnotation, drawYAxis } from '../utils/commonFunctions';
import { chartTitleCSS } from '../utils/commonStyles';

export const drawCurve = (svg, chartGeom, scales, data, colours) => {
	/* data is array of channelData */
	/* https://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js */
	const makeLinePath = line()
		.x(d => scales.x(d.concat_pos))
		.y(d => scales.y(d.coverage))
		.curve(curveLinear);
	// .curve(curveCatmullRom.alpha(0.3));

	svg.selectAll('.line').remove();
	try {
		svg.selectAll('.line')
			.data(data)
			.enter()
			.append('path')
			.attr('class', 'line')
			.attr('fill', 'none')
			.attr('stroke', (d, i) => colours[i % colours.length])
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

class CoveragePlot extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chartGeom: {} };
	}
	componentDidMount() {
		const newState = {
			SVG: select(this.DOMref),
			chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()),
		};
		newState.scales = calcScales(newState.chartGeom, this.props.coverageData, 'concat_pos', 'coverage', ['logY']);
		drawAxes(newState.SVG, newState.chartGeom, newState.scales);
		drawCurve(newState.SVG, newState.chartGeom, newState.scales, this.props.coverageData, this.props.colours);
		drawGenomeAnnotation(newState.SVG, newState.chartGeom, newState.scales, this.props.genomeAnnotation);
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

export default CoveragePlot;
