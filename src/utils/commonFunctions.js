import { scaleLinear, scaleLog } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
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
export const drawYAxis = (svg, chartGeom, scales, numTicks) => {
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

	if (!Array.isArray(data[0])) {
		var x = [];
		var y = [];
		data.forEach(element => {
			x.push(element[xAxis]);
			y.push(element[yAxis]);
		});
	} else {
		var x = [];
		var y = [];
		data.forEach(sample => {
			sample.forEach(element => {
				x.push(element[xAxis]);
				y.push(element[yAxis]);
			});
		});
	}
	const maxX = Math.max(...x);
	const minX = Math.min(...x);
	const maxY = Math.max(...y);
	const minY = Math.min(...y);
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

const drawGenomeAnnotation = (svg, chartGeom, scales, annotation) => {
	// svg.selectAll(".gene").remove(); /* only added once, don't need to remove what's not there */

	const primers = annotation.primers;
	const primerNames = Object.keys(primers);
	const primerHeight = 8;
	const primerRoof = chartGeom.height - chartGeom.spaceBottom + 20; /* all primers & genes below this */

	const primersSel = svg
		.selectAll('.primer')
		.data(primerNames)
		.enter()
		.append('g');

	primersSel
		.append('rect')
		.attr('class', 'primer')
		.attr('x', name => scales.x(primers[name].forward[0]))
		.attr('y', (d, i) => (i % 2 ? primerRoof : primerRoof + primerHeight))
		.attr('width', name => scales.x(primers[name]['reverse'][1]) - scales.x(primers[name].forward[0]))
		.attr('height', primerHeight)
		.style('fill', 'lightgray')
		.style('stroke', 'none');

	const geneHeight = 15;
	const geneRoof = primerRoof + 2 * primerHeight + 5;
	const calcYOfGene = name => (genes[name].strand === 1 ? geneRoof : geneRoof + geneHeight);

	const genes = annotation.genes;
	const geneNames = Object.keys(annotation.genes);

	const genesSel = svg
		.selectAll('.gene')
		.data(geneNames)
		.enter()
		.append('g');

	genesSel
		.append('rect')
		.attr('class', 'gene')
		.attr('x', name => scales.x(genes[name].start))
		.attr('y', calcYOfGene)
		.attr('width', name => scales.x(genes[name].end) - scales.x(genes[name].start))
		.attr('height', geneHeight)
		.style('fill', 'none')
		.style('stroke', 'gray');

	/* https://bl.ocks.org/emmasaunders/0016ee0a2cab25a643ee9bd4855d3464 for text attr values */
	genesSel
		.append('text')
		.attr('x', name => scales.x(genes[name].start) + (scales.x(genes[name].end) - scales.x(genes[name].start)) / 2)
		.attr('y', calcYOfGene)
		.attr('dy', '2px') /* positive values bump down text */
		.attr('text-anchor', 'middle') /* centered horizontally */
		.attr('font-size', '14px')
		.attr('alignment-baseline', 'hanging') /* i.e. y value specifies top of text */
		.style('fill', 'black')
		.text(name => (name.length > 3 ? '' : name));
};
