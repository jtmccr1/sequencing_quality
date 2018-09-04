const fs = require('fs');
const R = require('ramda');
const RA = require('ramda-adjunct');
const glob = require('glob');
const path = require('path');

// if (args.indexOf('-h') > -1 || args.length != 3) {
// 	console.log('Useage:');
// 	console.log('babel-node makAllData.js maximum output.json');
// 	console.log(
// 		'This script takes all the files matching the discription given and adds each genome to one list while keeping the SPECID reference. It removes any allele with freq 0 (found in one sample)'
// 	);
// 	process.exit(1);
// }
const objFromListWith = R.curry((fn, list) => R.chain(R.zipObj, R.map(fn))(list));
const topDir = path.resolve('./data/processedSNV/'); //path.resolve(args[1]);
const outputFile = './data/allVariants.json'; // args[2];
let allData = {};
glob('*.json', { cwd: topDir }, function(err, files) {
	if (err) {
		console.log(err);
	} else {
		// a list of paths to javaScript files in the current working directory
		for (const sampleFile of files) {
			//read in sample
			const sampleData = JSON.parse(fs.readFileSync(`${topDir}/${sampleFile}`, 'utf8'));
			const alleles = sampleData.genome.filter(allele => allele.freq > 0 && allele.freq < 0.5);
			const allelesWithSampleKey = R.map(R.assoc('Sample', sampleData.Sample[0].split('_')[0]), alleles);
			allData = R.assoc(sampleData.Sample[0].split('_')[0], allelesWithSampleKey, allData);
		}
		fs.writeFile(outputFile, JSON.stringify(allData, null), 'utf8', err => {
			if (err) throw err;
		});
	}
});
