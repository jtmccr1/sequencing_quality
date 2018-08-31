const fs = require('fs');
import { filterSegment } from './filter';

const args = process.argv.slice(2);
// Look for help
if (args.indexOf('-h') > -1 || args.length != 5) {
	console.log('Useage:');
	console.log('babel-node filter.js sample.json filtered.json coverageCutoff mininumFrequency maximumFrequency');
	console.log(
		'This script takes in a json file and filters the position entries based on coverage. It then filters the allele entries based on frequency. Note the consensus at each position that meets the coverage requirement is kept.'
	);
	process.exit(1);
}
const inputFile = args[0];
const outputFile = args[1];
const coverage = parseFloat(args[2]);
const mininumFrequency = parseFloat(args[3]);
const maximumFrequency = parseFloat(args[4]);

fs.readFile(inputFile, 'utf8', function(err, data) {
	if (err) throw err; // we'll not consider error handling for now
	const sample = JSON.parse(data);
	sample.genome.forEach(segment => filterSegment(segment, coverage, mininumFrequency, maximumFrequency));

	const filteredSample = JSON.stringify(sample, null);
	fs.writeFile(outputFile, filteredSample, err => {
		if (err) throw err;
		console.log('Data written to file');
	});
});
