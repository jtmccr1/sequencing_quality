import React from 'react';
import Filters from './SegmentForm';
import FrequencyForm from './FrequencyForm';
class FrequencyAndSegmentSelection extends React.Component {
	render() {
		return (
			<div>
				<Filters
					updateDisplay={this.props.updateDisplay}
					selectedPositions={this.props.selectedPositions}
					filterPosition={this.props.filterPosition}
				/>
				<FrequencyForm />
			</div>
		);
	}
}

export default FrequencyAndSegmentSelection;
