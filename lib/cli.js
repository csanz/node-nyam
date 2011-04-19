#!/usr/bin/env node

var os = require('os')
 , nyam = require('./nyam')
 , exec = require('child_process').exec
 , opt = require('optimist').argv
 , sys = require('sys')
 , msg
 , data;

/**
 * Run Nyam
 *
 * @api private
 */
run_nyam = function() {
	msg = opt._;
	if (opt._.length === 0) {
		opt._ = null;
	}
	opt.help = opt.help || opt.h;
	opt.message = opt.message || opt.m;
	opt.list = opt.list || opt.l;
	opt.setup = opt.setup || opt.s;
	opt.debug = opt.debug || opt.d;

	nyam.has_config(function(success){
		if(!success && !opt.setup?true:false) {
			console.log("\nrun nyam -s to setup your yammer client\n");
			return;
		}else{
			if (opt.help) {
		        console.log(nyam.help);
			} else if (opt.list){	
				nyam.get_latest(function(err, success){
					if(!success){
						console.log(err);
						console.log("\nbad authentication tokens, need to re-initialize\n");
						console.log("\trun: $nyam -s\n");
					}
				});		
			} else if (opt.setup){
				nyam.setup(true, function(response){
					console.log(response);
				})	
			} else {
				if (msg!="" || opt.message) {
					data = msg[0] || opt.message;
					if (msg[0]==null && opt.message==true) return console.log("\nmissing text! try again\n");
						nyam.post_update(data, function(err,json){
						});
				} else {
					console.log(nyam.help);
				}	
			}			
		}		
	});
}
run_nyam();
