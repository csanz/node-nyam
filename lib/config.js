/**
 * Module dependencies.
 */

var fs = require('fs')
  , noop = function(){};

/**
 * Expose constructor.
 */

module.exports = Config;
/**
 * Initialize a new `Config`.
 *
 * @param {Object} conf
 * @api public
 */

function Config() {
	var file_exits = false
	   , config;
	try {
		fs.realpathSync('./config.json');
		file_exits = true;
		config = JSON.parse(fs.readFileSync("./config.json","utf8"));
	}catch(e){}
	this.app_consumer_key = 
		(file_exits) ? config.app_consumer_key : this.app_consumer_key || "MmDM8uXJsM3cd9kNy4QIQ";
	this.app_consumer_secret = 
		(file_exits) ? config.app_consumer_secret : this.app_consumer_secret || "oV0PciEcx6vjrMeKnpr3PbRkV5kSYGVygy0JhIvtX4" ;
	this.oauth_access_token = 
		(file_exits) ? config.oauth_access_token : this.oauth_access_token || "";
	this.oauth_token_secret = 
		(file_exits) ? config.oauth_token_secret : this.oauth_token_secret || "";
};
/**
 * Save data.
 *
 * @param {Function} fn
 * @api public
 */

Config.prototype.save = function(fn){
  var data = JSON.stringify(this);
  fs.writeFile("./config.json", data, fn || noop);
  return this;
};

/**
 * Load data.
 *
 * @param {Function} fn
 * @api public
 */

Config.prototype.load = function(fn){
  var self = this
    , fn = fn || noop;

  fs.readFile("./config.json", 'utf8', function(err, json){
    if (err) return fn(err);

    var data = JSON.parse(json)
      , keys = Object.keys(data)
      , len = keys.length;

    for (var i = 0; i < len; ++i) {
      self[keys[i]] = data[keys[i]];
    }
    fn();
  });

  return this;
};
