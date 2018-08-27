import { scaleLinear, scaleLog } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import * as _ from 'lodash';
const dataFont = 'Lato'; // should be centralised

const removeXAxis = svg => {
	svg.selectAll('.x.axis').remove();
};

const removeYAxis = svg => {
	svg.selectAll('.y.axis').remove();
};

export const drawXAxis = (svg, chartGeom, scales, numTicks) => {
	removeXAxis(svg);
	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', `translate(0,${chartGeom.height - chartGeom.spaceBottom})`)
		.style('font-family', dataFont)
		.style('font-size', '12px')
		.call(axisBottom(scales.x).ticks(numTicks.x));
};
export const drawYAxis = (svg, chartGeom, scales, numTicks = { x: 5, y: 5 }) => {
	removeYAxis(svg);
	svg.append('g')
		.attr('class', 'y axis')
		.attr('transform', `translate(${chartGeom.spaceLeft},0)`)
		.style('font-family', dataFont)
		.style('font-size', '12px')
		.call(axisLeft(scales.y).ticks(numTicks.y));
};

export const drawAxes = (svg, chartGeom, scales, numTicks = { x: 5, y: 5 }) => {
	drawXAxis(svg, chartGeom, scales, numTicks.x);
	drawYAxis(svg, chartGeom, scales, numTicks.y);
};

export const calcScales = (chartGeom, data, xAxis, yAxis, log = []) => {
	// Needs to work for both array of data to plot and array of arrays of data to plot

	const maxX = _.max(data[xAxis]);
	const minX = _.min(data[xAxis]);
	const maxY = _.max(data[yAxis]);
	const minY = _.min(data[yAxis]);
	var scales = {
		x: scaleLinear()
			.domain([minX, maxX])
			.range([chartGeom.spaceLeft, chartGeom.width - chartGeom.spaceRight]),
		y: scaleLinear()
			.domain([minY, maxY])
			.range([chartGeom.height - chartGeom.spaceBottom, chartGeom.spaceTop]),
	};
	if (log.indexOf('logY') > -1) {
		scales.y = scaleLog()
			.domain([minY, maxY])
			.range([chartGeom.height - chartGeom.spaceBottom, chartGeom.spaceTop]);
	}
	if (log.indexOf('logX') > -1) {
		scales.x = scaleLog()
			.domain([minX, maxX])
			.range([chartGeom.spaceLeft, chartGeom.width - chartGeom.spaceRight]);
	}
	return scales;
};

export const drawGenomeAnnotation = (svg, chartGeom, scales, annotation) => {
	// svg.selectAll(".gene").remove(); /* only added once, don't need to remove what's not there */

	const geneHeight = 20;
	const geneRoof = chartGeom.height - chartGeom.spaceBottom; /* all primers & genes below this */

	const genes = annotation.genes;
	///const geneNames = Object.keys(annotation.genes);
	removeXAxis(svg);
	svg.selectAll('.rect')
		.data(annotation)
		.enter()
		.append('rect')
		.attr('x', d => scales.x(d.ORFstart))
		.attr('y', d => (d.verticleOffSet === 0 ? geneRoof : geneHeight + geneRoof))
		.attr('width', d => scales.x(d.ORFend) - scales.x(d.ORFstart))
		.attr('height', geneHeight)
		.style('fill', 'none')
		.style('stroke', 'gray');

	/* https://bl.ocks.org/emmasaunders/0016ee0a2cab25a643ee9bd4855d3464 for text attr values */
	svg.selectAll('.text')
		.data(annotation)
		.enter()
		.append('text')
		.attr('x', d => scales.x(d.ORFstart) + (scales.x(d.ORFend) - scales.x(d.ORFstart)) / 2)
		.attr('y', d => (d.verticleOffSet === 0 ? geneRoof : geneHeight + geneRoof)) //small fragmens under
		.attr('dy', '5px') /* positive values bump down text */
		.attr('text-anchor', 'middle') /* centered horizontally */
		.attr('font-size', '10px')
		.attr('alignment-baseline', 'hanging') /* i.e. y value specifies top of text */
		.style('fill', 'black')
		.text(d => d.name);
};
