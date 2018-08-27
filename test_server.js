const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

app.use(express.static('./data'));

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () => console.log('Development data collector running. Frontend should now work.'));

module.exports = app;
