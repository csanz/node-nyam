/**
 * Static class dependencies.
 */
var fs = require('fs')
    , https
    , http = require('http')
    , path = require('path')
    , querystring = require('querystring')
    , url = require('url')
    , util = require('util')
    , OAuth = require('oauth').OAuth
    , ConfigObj = require('./config')
    , config = new ConfigObj()
    , utils = require('./utils')
    , nyam = require('./nyam')
    , colors = require('colors');

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
    , Settings
    , users = [];

var oa = new OAuth(
    config.base_url+'/oauth/request_token',
    config.base_url+'/oauth/access_token',
    config.app_consumer_key,
    config.app_consumer_secret,
    '1.0',null,'HMAC-SHA1'
);

function User(id,full_name,body){
  this.id = id;
  this.full_name = full_name;
  this.body = body;
}
function Response(err,success,json){
  this.err = err;
  this.success = success;
  this.json = json;
}

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
 * Setup yammer
 *
 * @param {Pointer} callback
 * @api public
 */
exports.setup = function(verbose, callback){
    console.log(config.override_status);
    oa.getOAuthRequestToken(
        function(error, oauth_token, oauth_token_secret, results){
            if(error) { utils.display_error(error);
            } else {
                if (verbose) console.log('oauth_token :' + oauth_token);
                if (verbose) console.log('oauth_token_secret :' + oauth_token_secret);
                if (verbose) console.log('requestoken results :' + util.inspect(results));
                console.log('\n:::::: we need to give this CLI tool access to yammer :::::::\n'.green.bold);
                console.log('\nNavigate to: '.green + 'https://www.yammer.com/oauth/authorize?oauth_token='.grey.bold+ oauth_token.grey.bold+'\n');
                return input("Enter authorization code: ".green, function(oauth_verifier){
                    oa.getOAuthAccessToken(
                    oauth_token,
                    oauth_token_secret,
                    oauth_verifier,
                    function(error, oauth_access_token, oauth_access_token_secret, results2) {
                        if(error){ utils.display_error(error);
                        } else {
                            config.oauth_access_token = oauth_access_token;
                            config.oauth_token_secret = oauth_access_token_secret;
                            config.save();

                            console.log('\n:::::::: setup complete! now go use nyam!!! :::::::: \n'.green.bold)
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
  oa.post(config.base_url+'/api/v1/messages.json', config.oauth_access_token, config.oauth_token_secret, { body: data }, function(error, data) {
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
exports.get_latest = function(verbose, callback){
    oa.get(config.base_url+'/api/v1/messages/following.json?newer_than='+max_id,
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
                    result.from = '@'+user_information[result.sender_id].full_name;
                    r.push(result);
                }
                console.log('\n::: latest yams ::::\n'.green);
                return view_yams(r.reverse(), callback);
            }
    });
}
/**
 * Search yams
 *
 * @param {Pointer} callback
 * @param {String} keyword
 * @api public
 */
exports.search = function(verbose, keyword, num_per_page, callback){
    oa.get(config.base_url+'/api/v1/search.json?search='+keyword+'&num_per_page=2',
        config.oauth_access_token,
        config.oauth_token_secret,
        function(err,json) {
            if(err) {
                callback(err, false);
            } else {
                var messages = []
                  , feed = JSON.parse(json)
                  , references = feed.messages.messages
                  , search_results = [];
                for (var i in references) {
                    if(references[i].sender_type=='user') {
                      search_results.push(references[i]);
                    }
                }
                console.log('\n::: search results ::::\n'.green);
                for (var item in search_results.reverse()){
                  var result = search_results[item];
                  (function(r){
                    oa.get(config.base_url+'/api/v1/users/'+r.sender_id+'.json',
                       config.oauth_access_token,
                       config.oauth_token_secret,
                       function(err,json) {
                           if(err) {
                              console.log(err)
                           } else {
                              var usr = JSON.parse(json);
                              view_yam(usr.full_name,r.body.plain);
                           }
                    });
                  })(result);
                }
            }
    });
}
/**
 * Get yam user
 *
 * @param {Boolean} verbose
 * @param {Integer} id
 * @api public
 */
exports.get_user = function(verbose, id, callback){
  oa.get(config.base_url+'/api/v1/users/'+id+'.json',
      config.oauth_access_token,
      config.oauth_token_secret,
      function(err,json) {
          if(err) {
              callback(err,false,null)
          } else {
              var feed = JSON.parse(json);
              callback(null,true,feed);
          }
  });
}
/**
 * View / template
 *
 * @param {Array} list
 * @param {String} title
 * @param {Pointer} callback
 * @api private
 */
view_yams = function(list, callback){
    if (list.length) {
      for (var i in list){
          console.log('\n' + list[i].from.green + ": " + list[i].body.plain.grey);
      }
      console.log('\n')
    }
}
view_yam = function(from, body){
  console.log(from.green + ": " + body.grey + '\n');
}
exports.help = '\nUsage: nyam [action] [options]'+
    '\n\n\t[Options]'+
    '\n\t-h, --help\t\tDisplay this help page'+
    '\n\t\t\t\t\tex: nyam -h'+
    '\n\t-l, --list\t\tDisplay messages inside the general feed'+
    '\n\t\t\t\t\tex: nyam -l'+
    '\n\t-s, --setup\t\tIt will start the setup/auth process'+
    '\n\t\t\t\t\tex: nyam -s'+
    '\n\t--verbose\t\tDisplay more execution data'+
    '\n\t\t\t\t\tex: nyam -s --verbose'+
    '\n\t-v, --version\t\tDisplay version'+
    '\n\t\t\t\t\tex: nyam -v'+
    '\n\n';
