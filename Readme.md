nyam
=====

nyam is a node.js CLI tool for easy posting and reading of Yammer feeds. 

Installation
------------

With [npm](http://github.com/isaacs/npm):

    npm install nyam

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

Enjoy! 

For developers
-------------------------------------

  * Fork this project
  * Clone your fork
  * Check out: http://developer.yammer.com/api/
  * Add some code
  * Test!
  * Send pull request

Also check out our issues area for things people are requesting or bugs (not many right now hehe) 

Don't be shy! :-)



