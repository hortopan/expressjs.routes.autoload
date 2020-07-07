module.exports = function(loadPath,recursive){

	const express = require('express');
	const fs = require('fs');
	const path = require('path');

	let router = express.Router();
	
	if (!loadPath) loadPath  = './routes';
	
	let walk = function(dir) {
		let results = []
		let list = fs.readdirSync(dir)
		list.forEach(function(file) {
			file = dir + '/' + file
			let stat = fs.statSync(file)
			if (stat && stat.isDirectory()) results = results.concat(walk(file))
				else results.push(file)
			})
		return results;
	}

	let files = (recursive ? walk(loadPath) : fs.readdirSync(loadPath));
	
	for (let i in files){

		let file = (recursive ? path.resolve(files[i]) : path.resolve(loadPath , files[i]))

		if (fs.statSync(file).isFile() &&
			path.extname(file).toLowerCase() == '.js' &&
			path.basename(file).substr(0,1) != '.'){
			try {
				router = require(file)(router);
			} catch(e){
				throw new Error("Error when loading route file: " + file + " ["+e.toString()+"]");
			}
		}

	}

	return router;
}