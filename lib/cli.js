#!/usr/bin/env node

var os = require('os')
    , nyam = require('./nyam')
    , exec = require('child_process').exec
    , opt = require('optimist').argv
    , sys = require('sys')
    , utils = require('./utils')
    , ConfigObj = require('./config')
    , config = new ConfigObj()
    , msg
    , data;

/**
 * Run Nyam
 *
 * @api private
 */
run_nyam = function() {
    
    //collect string passed in
    //with parameter
    
    data = opt._;
    
    if (opt._.length === 0) {
        opt._ = null;
    }
    opt.help = opt.help || opt.h;
    opt.message = opt.message || opt.m;
    opt.list = opt.list || opt.l;
    opt.setup = opt.setup || opt.s;
    opt.verbose = opt.verbose;
    opt.version = opt.version || opt.v;
    opt.find = opt.find || opt.f;

    utils.file_exists(opt.verbose, config.path, function(success,json,err){	
      if(opt.verbose) utils.display_json('Config',json);
      if(!success && !opt.setup?true:false) {
          console.log("\nrun ".green.bold + "nyam -s".bold +" to setup your yammer client config!\n".green.bold);
      }else{
        
        // --help
        
        if (opt.help) {
          console.log(nyam.help);
        
        // --version
        
        } else if (opt.version){
          console.log("0.0.7"); //temporary, I'm moving cli.js to the root at some point. 
        
        // --list / latest
        
        } else if (opt.list){	
          nyam.get_latest((opt.debug)?true:false, function(err, success){
            if(!success) utils.need_setup(err);
          });

        // --search

        } else if (opt.find){	
          utils.isnull(opt.find,"missing search keyword, try again",function(isnull){
            if(!isnull) {
              nyam.search(opt.verbose, opt.find,10, function(err, success){
                if(!success) utils.need_setup(err);
              });  
            }            
          })
  
        // --setup
        
        } else if (opt.setup){
          nyam.setup((opt.debug)?true:false, function(response){
              console.log(response);
          })	
            
        // --message
            
        } else {
          if (data!="" || opt.message) {
              message = data[0] || opt.message;
          if (data[0]==null && opt.message==true) return console.log("\nmissing text! try again\n");
              nyam.post_update(message, function(err,json){
          });
          } else {
              console.log(nyam.help);
          }
        }
      }
    });
}
run_nyam();
