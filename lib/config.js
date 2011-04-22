/**
 * Module dependencies.
 */
var fs = require('fs')
    , noop = function(){}
    , utils = require('./utils')
    , path = require('path')
    , PATH_CONFIG = path.join(__dirname,'/config.json')
    , PATH_KEYS = path.join(__dirname,'/nyam_keys');

exports.path = PATH_CONFIG;

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
    var core_config_exits = true
    , override = false
    , config
    , keys;

    // handle core config
    utils.file_exists(false,PATH_CONFIG, function(success, file, err){
        if(success) config = file; 
        else core_config_exits = false
    });

    // handle keys override 
    utils.file_exists(false,process.env.HOME + '/.nyam_keys', function(success, file, err){
        if(success){ keys = file; override = true;
        } else { keys = JSON.parse(fs.readFileSync(PATH_KEYS,"utf8"));}
    });

    // consumer keys
    this.app_consumer_key = 
    (core_config_exits && !override) ? config.app_consumer_key : 
    this.app_consumer_key || keys.app_consumer_key;
    // consumer secret
    this.app_consumer_secret = 
        (core_config_exits && !override) ? config.app_consumer_secret : 
        this.app_consumer_secret || keys.app_consumer_secret;

    // access token
    this.oauth_access_token = 
        (core_config_exits) ? config.oauth_access_token : 
        this.oauth_access_token || "";

    // token secret
    this.oauth_token_secret = 
        (core_config_exits) ? config.oauth_token_secret : 
        this.oauth_token_secret || "";

    this.base_url = 
    (core_config_exits && config.base_url=="") ? config.base_url : 'https://www.yammer.com';

    this.override_status = (override) ? '\n[ Using override config at ~/.nyam_keys'.blue +' ]'.blue : '\n[ Using default keys config at '.blue + PATH_KEYS.blue + ' - to override see Readme ]'.blue;
    this.path = PATH_CONFIG;
};
/**
 * Save data.
 *
 * @param {Function} fn
 * @api public
 */
Config.prototype.save = function(fn){
  var data = JSON.stringify(this);
  fs.writeFile(PATH_CONFIG, data, fn || noop);
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
  fs.readFile(PATH_CONFIG, 'utf8', function(err, json){
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
