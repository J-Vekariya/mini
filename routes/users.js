var express = require('express');
var router = express.Router();
var compressor = require('node-minify');
var fs = require('fs');
var request = require('request');
var https = require('https');
var http = require('http');
var ip = require('ip');
var path=require('path');
var folder = 'data/'+new Date().getTime() + '/';
/* GET users listing. */
router.get('/downloadFile', function(req, res, next) {
	res.download(__dirname + '/../' + folder + 'new.min.js');
})

router.post('/minify', function(req, res) {
	var d = req.body;

	fs.mkdir(folder,function(e){
	    if(!e || (e && e.code === 'EEXIST')){
	        //do something with contents
	    } else {
	        //debug
	        console.log(e);
	    }
	});
	var download = function(url, dest, callback){

	    request.get(url)
	    .on('error', function(err) {console.log(err)} )
	    .pipe(fs.createWriteStream(dest))
	    .on('close', callback);

	};
	var urlList = d.links;
	var files = [];
	var i = 0;
	function getFiles(callbackjs, callbackcss){
		var extension;
		urlList.forEach( function(str) {
			var filename =  str.split('/').pop();
			console.log('Downloading ' + filename);
			extension = filename.split('.').pop();
			files.push(folder + filename);
			download(str, files[i], function(){
				console.log('Finished Downloading' + filename);	
			});
			i++;
		});
		if(extension == 'js'){
			callbackjs();
		}
		else if(extension == 'css'){
			callbackcss();
		}
	}
	getFiles(function(){
		var f;
		setTimeout(function(){
			f= folder+'out.js';
			compressor.minify({
			  compressor: 'no-compress',
			  input: files,
			  output: f,
			  callback: function (err, min) {
			  }
			});
			// Using UglifyJS 

		    compressor.minify({
		      compressor: 'uglifyjs',
		      input: f,
		      output: folder+'new.min.js',
		      callback: function (err, min) {
		      	res.send({'file':__dirname + '/../' + folder + 'new.min.js'});
		    }
		})
		},4000);
	}, function(){
		var f;
		setTimeout(function(){
			f= folder+'out.css';
			compressor.minify({
			  compressor: 'no-compress',
			  input: files,
			  output: f,
			  callback: function (err, min) {
			  }
			});
			// Using UglifyJS 

			compressor.minify({
			  compressor: 'sqwish',
			  input: f,
			  output: folder+'new.min.css',
			  options: {
			    strict: true 
			  },
			  callback: function (err, min) {		      
		      	res.send({'file':__dirname + '/../' + folder + 'new.min.css'});
		      }
			});
		},10000);
	});
	
    
});

module.exports = router;
