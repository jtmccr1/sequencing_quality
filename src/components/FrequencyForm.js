import React from 'react';

export default function FrequencyForm(props) {
	function updatePositions(evt) {
		console.log(evt.target.value);
	}
	return (
		<form action="" id="directory-filters">
			<div className="group">
				<label htmlFor="frequency">Frequency cutoff</label>
				<br />
				<input
					type="float"
					name="frequency"
					placeholder="0.001"
					id="frequency"
					// value={props.currentName}
					onChange={updatePositions}
				/>
			</div>
		</form>
	);
}
