#!/usr/bin/env node

var exec, 
	finish, 
	next, 
	nyam, 
	opt, 
	os, 
	run;
	
s = require('os');
nyam = require('./nyam');
exec = require('child_process').exec;
opt = require('optimist').argv;
run = function() {
	console.log("hello");
}