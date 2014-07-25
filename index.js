module.exports = function(path,recursive){

	var express = require('express');
	var router = express.Router();
	var fs = require('fs');

	
	
	if (!path){
		path  = './routes';
	} 
	
	var walk = function(dir) {
		var results = []
		var list = fs.readdirSync(dir)
		list.forEach(function(file) {
			file = dir + '/' + file
			var stat = fs.statSync(file)
			if (stat && stat.isDirectory()) results = results.concat(walk(file))
				else results.push(file)
			})
		return results;
	}

	var files = [];
	if (!recursive){
		files = fs.readdirSync(path);
	} else {
		files = walk(path);
	}
	
	for (var i in files){

		var file = '';
		if (!recursive){
			file = path + '/' + files[i];
		} else {
			file = files[i];
		}

		if (fs.statSync(file).isFile()){
			router = require(file)(router);
		}

	}

	return router;
}
