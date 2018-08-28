import React from 'react';
import { css } from 'glamor';
import CoveragePlot from './coveragePlot';
import VariantPlot from './variantPlot';
import { channelColours } from '../utils/commonStyles';
import CummulativeDistribution from './cummulativeDistribution';
import FrequencyAndSegmentSelection from './FrequencyAndSegmentSelection';

const panelContainer = css({
	width: 'calc(100%-20px)',
	height: '500' /* adjusting these will also adjust the graphs */,
	minHeight: '500px',
	margin: '10px 10px 10px 10px',
});

export const panelTitle = css({
	fontWeight: 'bold',
	fontSize: '1.3em',
	paddingLeft: '20px',
});

const flexRow = css({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	height: 'calc(100% - 25px)',
});

class Summary extends React.Component {
	//Filtering here
	render() {
		return (
			<div>
				<div {...panelContainer}>
					<div {...panelTitle} />
					<div {...flexRow}>
						<FrequencyAndSegmentSelection
							style={{ width: '25%', margin: 'auto', height: '100%' }}
							title={'Filter data'}
							selectedPositions={this.props.selectedPositions}
							filterPosition={this.props.filterPosition}
							updateDisplay={this.props.updateDisplay}
						/>
						<CoveragePlot
							style={{ width: '25%', margin: 'auto', height: '100%' }}
							title={'Coverage'}
							coverageData={this.props.coverageData}
							colours={channelColours}
							genomeAnnotation={this.props.genomeAnnotation}
						/>
						<VariantPlot
							style={{ width: '25%', margin: 'auto', height: '100%' }}
							title={'Frequency'}
							variantData={this.props.variantData}
							colours={channelColours}
							genomeAnnotation={this.props.genomeAnnotation}
						/>
						<CummulativeDistribution
							style={{ width: '25%', margin: 'auto', height: '100%' }}
							title={'CDF of variant frequencies'}
							variantData={this.props.variantData}
							colours={channelColours}
						/>
					</div>
				</div>
				<div {...panelContainer}>
					<h1> Sample and run selectors</h1>
				</div>
			</div>
		);
	}
}

export default Summary;
