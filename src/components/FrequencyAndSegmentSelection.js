import React from 'react';
import Filters from './SegmentForm';
class FrequencyAndSegmentSelection extends React.Component {
	render() {
		return (
			<div>
				<Filters
					updateDisplay={this.props.updateDisplay}
					selectedPositions={this.props.selectedPositions}
					filterPosition={this.props.filterPosition}
				/>
			</div>
		);
	}
}

export default FrequencyAndSegmentSelection;
