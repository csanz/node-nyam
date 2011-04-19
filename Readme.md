nyam
=====

nyam is a node.js CLI tool for easy posting and reading of Yammer feeds. 

Installation
------------

With [npm](http://github.com/isaacs/npm):

	npm install nyam
	
Clone this project:

	git clone http://github.com/csanz/nyam.git
	
CLI
---

	Usage: nyam [action] [options]

	[Options]
	-h, --help        Display this help page
	-l, --list        Display messages inside the general feed
	                     ex: nyam -l
	-m, --msg          Post a message to yammer
	                     ex: nyam -m "I'm working on nyam"
	                     ex: nyam "I don't require a switch"
	-s, --setup       It will start the setup/auth process
	                     ex: nyam
	                     
	Coming Soon:
	
	[Options]
	-g,  --group       Specify a group to view messages from or post a message to
	                   Used alone, it will list groups that you can post to.
	-rt, --realtime    A flag you can set to get realtime updates
	-t,  --topic       Getting messages from a certain topic
	

Setup your Yammer account w/ nyam
-------------------------------------

Log on to Yammer and create a new application

https://www.yammer.com/<DOMAIN>/client_applications/new
	
Bring the new keys inside lib/config.js

Or you can use Geekli.st's app keys and just continue on with the setup.

Start the setup process

	$nyam -s
	
follow the instructions and then create credentials.json 

    $nyam -l


	