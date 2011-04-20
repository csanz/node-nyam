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