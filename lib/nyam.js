var OAuth = require('oauth').OAuth
  , fs = require('fs')
  , config = JSON.parse(fs.readFileSync("./config.json","utf8"));

var oauth_credentials = config.oauth_credentials || {};
/*
Request Token URL
https://www.yammer.com/oauth/request_token
Access Token URL
https://www.yammer.com/oauth/access_token
Authorize URL
https://www.yammer.com/oauth/authorize
*/
var oa = new OAuth(
  'https://www.yammer.com/oauth/request_token',
  'https://www.yammer.com/oauth/access_token',
	config.CONSUMER_KEY,
	config.CONSUMER_SECRET,
	'1.0',null,'HMAC-SHA1'
);