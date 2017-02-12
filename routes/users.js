var express = require('express');
var router = express.Router();
var compressor = require('node-minify');
var fs = require('fs');
var request = require('request');
var https = require('https');
var http = require('http');
var ip = require('ip');
var path=require('path');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})

router.post('/minify', function(req, res) {
	var d = req.body;
	var folder = 'data/'+new Date().getTime() + '/';
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
		      	res.download(path.join(__dirname, '../', folder,'new.min.js')); 
		      	// fs.readFile(path.join(__dirname, '../', folder,'new.min.js'), function (err, file) {
				     // if (err) {
				     //     res.send(err)
				     // } else {
				     //     res.writeHead(200, {
				     //        "Content-Disposition": "attachment;filename=new.min.js"
				            
				     //    });
				     //    res.write(file);
				     //    res.end();
				     // }
		       // });
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
		      	// var path = path.resolve(".")+folder+'new.min.css';
		      	// res.download(path); // magic of download fuction
		      	//res.sendFile(folder+'new.min.js' , { root : rootFolder+'/../'});
		      	res.send("here");
		        // res.status(200).json({success : true, message : 'success', new_link: 'http://'+ip.address()+'/'+folder+'new.min.js'}).sendFile(folder+'new.min.js' , { root : __dirname});
		      	//res.download(folder+'new.min.js');
		      }
			});
		},10000);
	});
	
    
});

module.exports = router;
