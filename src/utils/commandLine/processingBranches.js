const fs = require('fs');
const R = require('ramda');
var glob = require('glob');
const path = require('path');
const args = process.argv.slice(2);
// Look for help
// if (args.indexOf('-h') > -1 || args.length === 4 || args.length===5) {
// 	console.log('Useage:');
// 	console.log('babel-node addSequencingIds.js SampleMetaData.json TopDir tailPattern output.json');
// 	console.log(
// 		'This script takes in a json of sample Metadata it looks for json files matching the SPECID following the path. It adds these files to the list.'
// 	);
// 	process.exit(1);
// }
const SampleMetaDataFile = './data/SampleMetaData.json'; //args[0];
const topDir = path.resolve('../withinhost_influenza_exploration/data/2014-2015_data/variant_calls/'); //path.resolve(args[1]);

const tailPattern = '**/*.flattened.filtered.json'; //`**/${args[2]};
const outputFile = './branches.tsv'; // args[2];

const SampleMetaData = JSON.parse(fs.readFileSync(SampleMetaDataFile, 'utf8'));

glob(tailPattern, { cwd: topDir }, function(err, files) {
	if (err) {
		console.log(err);
	} else {
		// a list of paths to javaScript files in the current working directory
		const file = fs.createWriteStream(outputFile);
		file.on('error', function(err) {
			/* error handling */
		});
		for (const sample of SampleMetaData) {
			const sampleFiles = R.filter(x => x.includes(sample.SPECID), files);
			if (sampleFiles.length === 1) {
				sampleFiles.push(sampleFiles[0]);
			} else if (sampleFiles.length < 1 || sampleFiles.length > 2) {
				throw new Error(`Found sample ${sample} ${sampleFiles.length} times`);
			}
			file.write(`${sample.SPECID}\t${sampleFiles[0]}\t${sampleFiles[1]} \n`);
			console.log(`${sample.SPECID}\t${sampleFiles[0]}\t${sampleFiles[1]}`);
		}

		file.end();
	}
});
