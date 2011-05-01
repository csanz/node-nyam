/**
 * Static class dependencies.
 */

var fs = require('fs')
  , colors = require('colors')
  , noop = function(){}


/**
 * Static funciton - File exists.
 *
 * @param {String} path
 * @api public
 */
exports.file_exists = function(verbose, path, callback){
    if(verbose)console.log('\nConfig Path: '.bold+ path);
    //this needs to be replaced with path.exists
    try {
        fs.realpathSync(path);
        callback(true, JSON.parse(fs.readFileSync(path,"utf8")), null);
    }catch(e){
        callback(false,null,e);
    }
}
/**
 * Static funciton - Display Errors
 *
 * @param {Object} error
 * @api public
 */
exports.display_error = function(error){
	console.log('\nError:\n'.bold)
	console.log(error.data.red)
	console.log('Check:\n'.bold)
	console.log('~/.nyam_keys (make sure this file is properly formatted)'.green)
	console.log('\n')
}
/**
 * Static funciton - Display Errors
 *
 * @param {Object} error
 * @api public
 */
exports.display_json = function(what,json){
	console.log('\n'+what.bold+':\n'.bold)
	console.log(json)
}
/**
 * Static funciton - Need Setup
 *
 * @param {Object} error
 * @api public
 */
exports.need_setup = function(error){
	console.log('\nError:\n'.bold)
	console.log(error.data.red)
	console.log("\nCheck yammer ops:\n".bold);
	console.log("\t - http://twitter.com/#!/yammerops");
	console.log("\t - http://status.yammer.com/");
  console.log("\nthis could also be a bad authentication tokens, need to re-initialize\n");
  console.log("\trun: $nyam -s\n");
}
/**
 * Static funciton - Is NULL BITCH! :D
 *
 * @param {String} data
 * @param {String} message
 * @api public
 */
exports.isnull = function(data, message, callback){
  if(data.length==null){
    console.log(message);
    callback(true);
  }else{
    callback(false);
  }
}
