var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var parseVariantData = require('./utils/parseData').parseVariantData;
var parseCoverageData = require('./utils/parseData').parseCoverageData;
var app = express();

// Get the variant files that hold the data from each sequencing library
let variantFilePaths = [];

const dataDir = path.join(__dirname, '..', 'data', 'variants'); // relative to the terminal when run, not where the source is located
fs.readdirSync(dataDir).forEach(file => {
	const filePath = path.join(dataDir, file);
	if (fs.lstatSync(filePath).isFile()) {
		variantFilePaths.push(filePath);
	}
});
console.log('There are ', variantFilePaths.length, 'variant files available.\n');
//request variant data
app.get('/requestVariantData', (req, res) => {
	var data = [];
	fs.readdirSync(path.join(__dirname, '..', 'data', 'variants')).forEach(file => {
		variants = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'variants', file), 'utf-8'));
		//Parse data
		parsedVariants = parseVariantData(variants);
		data.push(parsedVariants);
	});
	res.json(data);
});

app.get('/requestCoverageData', (req, res) => {
	var data = [];
	fs.readdirSync(path.join(__dirname, '..', 'data', 'variants')).forEach(file => {
		variants = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'variants', file), 'utf-8'));
		//Parse data
		parsedCoverage = parseCoverageData(variants);
		data.push(parsedCoverage);
	});
	res.json(data);
});

app.listen('3000');
