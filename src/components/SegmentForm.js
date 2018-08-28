import React from 'react';

export default function Filters(props) {
	function updatePositions(evt) {
		if (evt.keyCode === 13) {
			const value = evt.target.value;
			const seg = value.split(':')[0];
			let positions = value.split(':')[1];
			if (!positions) {
				props.filterPosition({ seg: seg });
			} else {
				positions = positions.split('-');
				const positionsArray = positions.map(p => parseInt(p) - 1);
				if (positionsArray.length < 2) {
					positionsArray[1] = positionsArray[0];
				}
				props.filterPosition({ seg: seg, pos: positionsArray });
			}
			//const object = evt.target.value;
			// console.log(object);
			//
		}
	}
	function updateText(evt) {
		props.updateDisplay(evt.target.value);
	}

	return (
		<div className="group">
			<label htmlFor="seg-pos">Filter positions:</label>
			<br />
			<input
				type="text"
				name="seg-pos"
				placeholder="Segment:1-10"
				id="seg-pos"
				onChange={updateText}
				value={props.selectedPositions}
				onKeyDown={updatePositions}
			/>
		</div>
	);
}
