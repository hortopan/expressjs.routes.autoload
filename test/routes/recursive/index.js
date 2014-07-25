module.exports = function(router){

	router.get('/recursive', function(req, res) {

		res.json({hello:'world'});
		res.end();

	});

	return router;
}
