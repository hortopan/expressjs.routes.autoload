export default function (router) {

	router.get('/recursive', function (req, res) {
		res.send('hello');
	});

	return router;
}

