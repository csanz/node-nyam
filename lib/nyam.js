/**
  nyam module 
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
 , Settings = JSON.parse(fs.readFileSync("./config.json","utf8"));

var max_id = 0
 , get_latest
 , input
 , get_latest_view
 , debug = Settings.debug;

var oa = new OAuth(
  'https://www.yammer.com/oauth/request_token',
  'https://www.yammer.com/oauth/access_token',
	Settings.app_consumer_key,
	Settings.app_consumer_secret,
	'1.0',null,'HMAC-SHA1'
);

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
exports.check = function(callback){
  //need to add check here
}
/* initialize yammer tokens */
exports.init = function(message, callback){
	console.log("\ninitializing...");
	var conf = new ConfigObj();
	if (debug) console.log(oa);
	oa.getOAuthRequestToken(
		function(error, oauth_token, oauth_token_secret, results){
		if(error) { console.log('Error:');console.log(error);
        } else {
			if (debug) console.log('oauth_token :' + oauth_token);
			if (debug) console.log('oauth_token_secret :' + oauth_token_secret);
			if (debug) console.log('requestoken results :' + sys.inspect(results));
			console.log('\n:::::: we need to give this app access to yammer :::::::\n');
			console.log('\nNavigate to: https://www.yammer.com/oauth/authorize?oauth_token='+ oauth_token+'\n');
			return input("Enter authorization code: ", function(oauth_verifier){
				oa.getOAuthAccessToken(
					oauth_token, 
					oauth_token_secret, 
					oauth_verifier,
					function(error, oauth_access_token, oauth_access_token_secret, results2) {
					  if(error){ console.log('Error:');console.log(error);
					  } else {
						conf.oauth_access_token = oauth_access_token;
						conf.oauth_token_secret = oauth_access_token_secret;
						conf.save();

						console.log('\nCongratulation! I saved your new tokens\n');	
						console.log('\toauth_access_token :' + oauth_access_token);
						console.log('\toauth_token_secret :' + oauth_access_token_secret);
						console.log('\nenjoy! nyam -l\n');
					  }
				});
			});
        }
	});
}
exports.post_update = function(post_body, callback){
	oa.post('https://www.yammer.com/api/v1/messages.json',
			Settings.oauth_access_token,
			Settings.oauth_token_secret,
			post_body, 
			"application/x-www-form-urlencoded",
		function(err, json){
			console.log(err);
			console.log(json);
		});
}
/* get latest yams */
exports.get_latest = function(callback){
	if (debug) console.log(Settings.oauth_access_token);
	if (debug) console.log(Settings.oauth_token_secret);
	oa.get('https://www.yammer.com/api/v1/messages.json?newer_than='+max_id,
		Settings.oauth_access_token,
		Settings.oauth_token_secret,
		function(err,json) {
			if(err) {
				callback(false);
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
get_latest_view = function(list, callback){
	if (list.length) {
	console.log("\n::: latest yams ::::\n");
	for (var i in list){
		console.log('\t' + list[i].from + ": " + list[i].body.plain);
	}
	callback(true);
	} else {
	callback(false);	
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
