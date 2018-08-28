import React from 'react';
import { select } from 'd3-selection';
import { line, curveLinear } from 'd3-shape';
import { calcScales, drawAxes, drawGenomeAnnotation } from '../utils/commonFunctions';
import { chartTitleCSS } from '../utils/commonStyles';

export const drawCurve = (svg, chartGeom, scales, data, colours) => {
	/* data is array of channelData */
	/* https://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js */
	const makeLinePath = line()
		.x(d => scales.x(d.concat_pos))
		.y(d => scales.y(d.coverage))
		.curve(curveLinear);
	// .curve(curveCatmullRom.alpha(0.3));

	let dataArray = [];
	data.forEach(element => {
		dataArray.push(element.data);
	});
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

class CoveragePlot extends React.Component {
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
			coverage: [],
		};
		this.props.coverageData.forEach(sample => {
			extremes.concat_pos.push(...sample.extremes.concat_pos);
			extremes.coverage.push(...sample.extremes.coverage);
		});
		const svg = select(node);
		const dimensions =
			Object.keys(this.state.chartGeom).length > 0
				? this.state
				: { chartGeom: calcChartGeom(this.boundingDOMref.getBoundingClientRect()) };

		const scales = calcScales(dimensions.chartGeom, extremes, 'concat_pos', 'coverage', ['logY']);
		drawCurve(svg, dimensions.chartGeom, scales, this.props.coverageData, this.props.colours);
		drawAxes(svg, dimensions.chartGeom, scales);
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
					width={this.state.chartGeom.width || 0}
					height={this.state.chartGeom.height || 0}
				/>
			</div>
		);
	}
}

export default CoveragePlot;
