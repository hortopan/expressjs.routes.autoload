module.exports = function(router){

	router.get('/', function(req, res) {

		res.json({hello:'world'});
		res.end();

	});

	return router;
}