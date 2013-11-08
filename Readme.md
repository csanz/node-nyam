nyam
=====

nyam is a node.js CLI tool for easy posting and reading of Yammer feeds. This is forked from https://github.com/csanz/node-nyam for fixing bug of process.binding() method.

Installation
------------

With [npm](http://github.com/isaacs/npm):

    npm install nyam -g

CLI
---

    Usage: nyam [options] [data]

    [Options]
    -h, --help        Display this help page
    -l, --list        Display messages inside the general feed
                         ex: nyam -l
    -m, --msg          Post a message to yammer
                         ex: nyam -m "I'm working on nyam"
                         ex: nyam "I don't require a switch"
    -s, --setup       It will start the setup/auth process
                         ex: nyam
    --verbose         Display more execution data, including errors
                         ex: nyam -s --verbose
    -v, --version     Display version
                         ex: nyam -v
    -f,  --find       Find + search mechanism 
                         ex: nyam -f "todo"
                     
    Coming Soon:

    [Options]
    -g,  --group       Specify a group to view messages from or post a message to
                       Used alone, it will list groups that you can post to.
    -rt, --realtime    A flag you can set to get realtime updates
    -t,  --topic       Getting messages from a certain topic
    -f,  --search      Search for tags and returns 10 items
    -u,  --users       Lists all users in the network


Setup your Yammer account w/ nyam
-------------------------------------

You can you Geekli.st application keys, or log on to Yammer and get your own app keys.

    https://www.yammer.com/<DOMAIN>/client_applications/new

To override nyam with your own app keys create the following file:

    ~/.nyam_keys

and add the following

    {
        "app_consumer_key": "<CONSUMER KEY HERE>",
        "app_consumer_secret": "<CONSUMER SECRET HERE>"
    }

NOW, you can start the setup process

    $nyam -s

Open Navigation URL in browser. If you are not login with yammer first then open it.

Authorize App, copy Authorization code and paste it on console, press enter key.

On success you can see access token detail on ~/.config.json

You can use CLI for see all detail

    $nyam --verbose

Enjoy! 

For developers
-------------------------------------
  * Fork this project
  * Clone your fork
  * Check out: https://developer.yammer.com/restapi/
  * Modify some code ad per you need.
  * Test!
  * Send pull request

Also check out our issues area for things people are requesting or bugs (not many right now hehe) 

Don't be shy! :-)



