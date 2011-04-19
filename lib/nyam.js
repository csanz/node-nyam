/**
 * Module dependencies.
 */
var fs = require('fs')
 , https
 , http = require('http')
 , path = require('path')
 , querystring = require('querystring')
 , url = require('url')
 , sys= require('sys')
 , OAuth = require('oauth').OAuth
 , ConfigObj = require('./config')
 , config = new ConfigObj();

/**
 * Class variables.
 */
var max_id = 0
 , get_latest
 , config_exists
 , input
 , get_latest_view
 , debug = false
 , is_created = false
 , Settings;

var oa = new OAuth(
  'https://www.yammer.com/oauth/request_token',
  'https://www.yammer.com/oauth/access_token',
   config.app_consumer_key,
   config.app_consumer_secret,
   '1.0',null,'HMAC-SHA1'
);
/**
 * Input Utility
 *
 * @param {String} message
 * @param {Pointer} callback
 * @api private
 */
input = function(message, callback){
	var stdin = process.openStdin()
	  , stdio = process.binding("stdio")
	  , data = "";
	stdio.setRawMode();
	console.log(message);
	stdin.on("data", function (c) {
	  c = c + "";
	  switch (c) {
	    case "\n": case "\r": case "\u0004":
	      stdio.setRawMode(false);
	      callback(data);
	      stdin.pause();
	      break
	    case "\u0003":
	      process.exit();
	      break
	    default:
	      data += c;
	      break
	  }
	})	
}
/**
 * Total Hack - has_config
 * Node lacks some more powerful file functions
 *
 * @param {Pointer} callback
 * @api private
 */
exports.has_config = function(callback){
	try {
		fs.realpathSync('~/.config.json');
		callback(true);
	} catch(e) {callback(false);}
}
/**
 * Setup yammer
 *
 * @param {Pointer} callback
 * @api public
 */
exports.setup = function(callback){
	oa.getOAuthRequestToken(
		function(error, oauth_token, oauth_token_secret, results){
		if(error) { console.log('Error:');console.log(error);
        } else {
			if (debug) console.log('oauth_token :' + oauth_token);
			if (debug) console.log('oauth_token_secret :' + oauth_token_secret);
			if (debug) console.log('requestoken results :' + sys.inspect(results));
			console.log('\n:::::: we need to give this CLI tool access to yammer :::::::\n');
			console.log('\nNavigate to: https://www.yammer.com/oauth/authorize?oauth_token='+ oauth_token+'\n');
			return input("Enter authorization code: ", function(oauth_verifier){
				oa.getOAuthAccessToken(
					oauth_token, 
					oauth_token_secret, 
					oauth_verifier,
					function(error, oauth_access_token, oauth_access_token_secret, results2) {
					  if(error){ console.log('Error:');console.log(error);
					  } else {
						config.oauth_access_token = oauth_access_token;
						config.oauth_token_secret = oauth_access_token_secret;
						config.save();

						console.log('\n\t>> setup complete! now go use nyam!!!\n')
						console.log('Enjoy!\n')
					  }
				});
			});
        }
	});
}
/**
 * Post update
 *
 * @param {String} data
 * @param {Pointer} callback
 * @api public
 */
exports.post_update = function(data, callback){
  oa.post("https://www.yammer.com/api/v1/messages.json", config.oauth_access_token, config.oauth_token_secret, { body: data }, function(error, data) {
    if (error) callback(JSON.parse(error.data));
    if (callback) callback(data);
  });
}
/**
 * Get latest yams
 *
 * @param {Pointer} callback
 * @api public
 */
exports.get_latest = function(callback){
	oa.get('https://www.yammer.com/api/v1/messages.json?newer_than='+max_id,
		config.oauth_access_token,
		config.oauth_token_secret,
		function(err,json) {
			if(err) {
				callback(err, false);
			} else {
				var feed = JSON.parse(json);
				var references = feed.references;
				var user_information = {};
				for (var i in references) {
					if(references[i].type=='user') {
						user_information[references[i].id] = references[i];
					}
				}
				var r = [];
				for (var i in feed.messages) {
					var result = feed.messages[i];
					max_id = (result.id > max_id) ? result.id : max_id;
					result.from = '@'+user_information[result.sender_id].name;
					r.push(result);
				}
				return get_latest_view(r, callback);
			}
		});	
}
/**
 * Get latest view / template
 *
 * @param {Array} list
 * @param {Pointer} callback
 * @api private
 */
get_latest_view = function(list, callback){
	if (list.length) {
		console.log("\n::: latest yams ::::\n");
		for (var i in list){
			console.log('\t' + list[i].from + ": " + list[i].body.plain);
		}
		console.log('\n')
		callback(null,true);
	} else {
		callback(null,false);	
	}
}
exports.help = '\nUsage: nyam [action] [options]'+
	'\n\n\t[Options]'+
	'\n\t-h, --help\t\tDisplay this help page'+
	'\n\t\t\t\t\tex: nyam -h'+
	'\n\t-l, --list\t\tDisplay messages inside the general feed'+
	'\n\t\t\t\t\tex: nyam -l'+
	'\n\t-s, --setup\t\tIt will start the setup/auth process'+
	'\n\t\t\t\t\tex: nyam -s'+
	'\n\n';
