#!/usr/bin/env node

var exec, finish, next, nyam, opt, os, run, sys;
os = require('os');
nyam = require('./nyam');
exec = require('child_process').exec;
opt = require('optimist').argv;
sys= require('sys');

run = function() {
	if (opt._.length === 0) {
		opt._ = null;
	}
	opt.help = opt.help || opt.h;
	opt.message = opt.message || opt.m;
	opt.list = opt.list || opt.l;
	opt.setup = opt.setup || opt.s;
	
	if (opt.help || !opt._) {
        console.log(nyam.help);
	}
	if (opt.list){
		nyam.get_latest(function(success){
			if(!success){
				console.log("\nbad authentication tokens, need to re-initialize\n");
				console.log("\trun: $nyam -i\n");
			}
		});		
	}
	if (opt.setup){
		nyam.init(opt.message, true, function(response){
			console.log(response);
		})
	}
	if (opt.message) {
		//need to add posting a new message
	}
}

run();
