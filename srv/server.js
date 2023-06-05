const cds = require('@sap/cds');

cds.once('bootstrap', app => {
	app.get('/endpoint', function(req, res, next) {
		// express handler logic here.
		res.status(202).send("OK");
	});
});
	
module.exports = cds.server;