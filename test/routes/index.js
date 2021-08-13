export default function(router){

	router.get('/', function(req, res) {
		res.send('hello');
	});

	return router;
}
