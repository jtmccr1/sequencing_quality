const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const parseVariantData = require('./utils/parseData').parseVariantData;
const parseCoverageData = require('./utils/parseData').parseCoverageData;
const parseGenomeAnnotation = require('./utils/parseData').parseGenomeAnnotation;
const app = express();
app.use(cors());

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
	let data = [];
	fs.readdirSync(path.join(__dirname, '..', 'data', 'variants')).forEach(file => {
		const variants = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'variants', file), 'utf-8'));
		//Parse data
		const parsedVariants = parseVariantData(variants);
		data.push(...parsedVariants);
	});
	res.json(data);
});

app.get('/requestCoverageData', (req, res) => {
	var data = [];
	fs.readdirSync(path.join(__dirname, '..', 'data', 'variants')).forEach(file => {
		const variants = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'variants', file), 'utf-8'));
		//Parse data
		var parsedCoverage = parseCoverageData(variants);
		data.push(parsedCoverage);
	});
	res.json(data);
});

app.get('/requestGenomeAnnotation', (req, res) => {
	const genome = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'or.bed.json'), 'utf-8'));
	//Parse data
	var parsedGenome = parseGenomeAnnotation(genome);

	res.json(parsedGenome);
});

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () => console.log('Development data collector running. Frontend should now work.'));
