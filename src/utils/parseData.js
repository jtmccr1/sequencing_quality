module.exports = {
	parseVariantData(data) {
		var parsedDataSet = [];
		var sample = data.Sample;
		const genome = data.genome;
		for (var i = 0; i < genome.length; i++) {
			//cycle through each segment
			var chr = genome[i].chr;
			for (var j = 0; j < genome[i].seq.length; j++) {
				var consensus = genome[i].seq[j].consensus;
				var coverage = genome[i].seq[j].coverage;
				var concat_pos = genome[i].seq[j].concat_pos;
				var pos = genome[i].seq[j].pos;
				for (var key in genome[i].seq[j].alleles) {
					var freq = genome[i].seq[j].alleles[key].freq;
					if (freq < 0.5) {
						var nt = genome[i].seq[j].alleles[key].nucleotide;
						var count = genome[i].seq[j].alleles[key].count;
						var datapoint = {
							Sample: sample,
							chr: chr,
							nucleotide: nt,
							consensus: consensus,
							pos: pos,
							concat_pos: concat_pos,
							freq: freq,
							count: count,
							coverage: coverage,
							mutationalClass: genome[i].seq[j].alleles[key].mutationalClass,
						};
						parsedDataSet.push(datapoint);
					}
				}
			}
		}
		return parsedDataSet;
	},
	parseCoverageData(data) {
		var parsedDataSet = [];
		var sample = data.Sample;
		const genome = data.genome;
		for (var i = 0; i < genome.length; i++) {
			//cycle through each segment
			var chr = genome[i].chr;
			for (var j = 0; j < genome[i].seq.length; j++) {
				var consensus = genome[i].seq[j].consensus;
				var coverage = genome[i].seq[j].coverage;
				var concat_pos = genome[i].seq[j].concat_pos;
				var pos = genome[i].seq[j].pos;
				var datapoint = {
					Sample: sample,
					chr: chr,
					concat_pos: concat_pos,
					consensus: consensus,
					coverage: coverage,
					pos: pos,
				};
				parsedDataSet.push(datapoint);
			}
		}
		//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
		parsedDataSet.sort(function(a, b) {
			return a.concat_pos > b.concat_pos ? 1 : b.concat_pos > a.concat_pos ? -1 : 0;
		});

		return parsedDataSet;
	},

	parseGenomeAnnotation(data) {
		var dataset = data.genome;
		var ORFboxes = [];
		var cumSize = 0;
		var offSet = 0;
		for (var i = 0; i < dataset.length; i++) {
			//cycle through each segment
			var segment = dataset[i];
			for (var j = 0; j < segment.ORF.length; j++) {
				var name = dataset[i].ORF[j].name;
				var ORF = dataset[i].ORF[j];
				var ORFsize = 0;
				for (var k = 0; k < ORF.regions.length; k++) {
					var region = ORF.regions[k];
					var geneBox = {
						name: name,
						ORFstart: region.start + cumSize,
						ORFend: region.stop + cumSize,
						verticleOffSet: offSet,
						fivePrimeUtrStart: cumSize + ORFsize,
						fivePrimeUtrEnd: region.start + cumSize,
						threePrimeUtrStart: region.stop + cumSize,
						threePrimeUtrEnd: cumSize + segment.size,
					};
					ORFboxes.push(geneBox);
					ORFsize = ORFsize + region.stop;
				}
				offSet = offSet - 1;
			}
			cumSize = cumSize + segment.size;
			offSet = 0;
		}
		return ORFboxes;
	},
};
