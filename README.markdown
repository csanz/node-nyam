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
	-g, --group       To be used with -l or -m
	                     ex: nyam -m "I'm still coding" -g engineering
	                     ex: nyam -l -g engineering
	-s, --setup       It will start the setup/auth process
	                     ex: nyam

Setup your Yammer account w/ nyam
-------------------------------------

(coming soon!)