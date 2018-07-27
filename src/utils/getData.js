const prefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

export const getData = function getData(route, Callback) {
	fetch(`${prefix}/${route}`)
		.then(res => res.json())
		.then(jsonData => {
			// console.log("setting run info to:", jsonData)
			Callback(jsonData, route);
		})
		.catch(err => {
			console.error(`Error in :${prefix}/${route}, ${err}`);
		});
};
