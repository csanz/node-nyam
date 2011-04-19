#!/usr/bin/env node

var os = require('os')
 , nyam = require('./nyam')
 , exec = require('child_process').exec
 , opt = require('optimist').argv
 , sys = require('sys')
 , msg = opt._;

run = function() {
	if (opt._.length === 0) {
		opt._ = null;
	}
	opt.help = opt.help || opt.h;
	opt.message = opt.message || opt.m;
	opt.list = opt.list || opt.l;
	opt.setup = opt.setup || opt.s;
	
	if (opt.help) {
        console.log(nyam.help);
	} else if (opt.list){	
		nyam.get_latest(function(success){
			if(!success){
				console.log("\nbad authentication tokens, need to re-initialize\n");
				console.log("\trun: $nyam -s\n");
			}
		});		
	} else if (opt.setup){
		nyam.init(opt.message, true, function(response){
			console.log(response);
		})
	} else {
		if (msg!=null || opt.message) {
			msg = msg[0] || opt.message;
			
			nyam.post_update(msg, function(err,json){

			});
			
		} else {
			console.log(nyam.help);
		}
		
		
	}
}

run();
