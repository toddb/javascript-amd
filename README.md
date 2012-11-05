# Sample for javascript AMD

There are presentation notes about this code at: http://www.slideshare.net/toddbr/javascript-firstclass-citizenery

## DESCRIPTION:

Sample code in javascript to demonstrate the requirejs library (using node.js) and jasmine for BDD-style testing.

It demonstrates test-driven client-side Javascript development, including linting & validation, merging, and minification.

It also demonstrates different types of testing: testing plain html, events and mocking (using promised-based development).

## FEATURES/PROBLEMS:

* to run tests and src/app.html you first need to build so that html is wrapped when not running via webserver

## TODO:

* complete cakefile port of rake
* [Done] <del>setup node.js as out-of-process localhost for serving up html files</del>
* [Done] <del>write this app using a REST style</del>

## SYNOPSIS:

Use rake to see all tasks. Key tasks are build, test:acceptance and test:specs (and server:start && test:server)

	$ rake -T
	rake all              # Build and release
	rake build            # Create the release [default]
	rake build:clean      # Removes files from dist and build
	rake build:compile    # Builds javascript through node.js
	rake build:copy       # Copies files to the dist folder
	rake clobber          # Removes all files from build and release
	rake docs:compile     # Create the documentation set
	rake docs:open        # Opens the documentation in a browser
	rake release          # Build and release to server using upload.sh - (not che...
	rake release:clean    # Cleans release folder
	rake release:prepare  # Creates the release folder
	rake server:start     # Starts test server on localhost:8888 - note: stdout is...
	rake test             # Opens all tests and examples in browser
	rake test:acceptance  # Run acceptance test in browser
	rake test:example     # Show example
	rake test:node        # Run spec tests in node.js
	rake test:server      # Run the example against the server
	rake test:specs       # Run spec tests in browser

Actually,  use `cake server:start` and you'll actually get console logs of the requests.

	$ cake server:start
	node-router server instance at http://localhost:8888/

	Static file server running at
	  => http://localhost:8888/
	CTRL + C to shutdown

	127.0.0.1 - - [Mon, 05 Nov 2012 02:52:28 GMT] "GET /orders/current HTTP/1.1" Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 - 200 - "" "Mozilla/5.0"

## REQUIREMENTS:

The app uses 

* ruby (currently using 1.8.7)
* rake (currently 0.8.7)
* node.js (currently 0.6.15)
* npm (currently 1.1.33)
* python (currently 2.6.1)
* Pygments (currently 1.5)

Tested on Max OS X (10.6.8) with Mozilla 14.0.1 and Chrome 22.

## ENVIRONMENT SETUP

Install node which should come with Node Package Manager

	$ node --version
	v0.8.1
	$ npm --version
	1.1.3

Installing Pygaments:

From the tarball release

* Download the most recent tarball from the download page (https://bitbucket.org/birkenfeld/pygments-main/downloads)
* Unpack the tarball
* <code>sudo python setup.py install</code>

Note that the last command will automatically download and install setuptools if you don't already have it installed. This requires a working internet connection. This will install Pygments into your Python installation's site-packages directory.

	$ pygmentize -V
	Pygments version 1.5, (c) 2006-2011 by Georg Brandl.

## BUILDING

In rake:

	$ rake build

In cake:

	$ cake build

## RELEASING

* create an upload.sh file that will release to your environment
* all release files in dist/

	$ rake release

## LICENSE:

(BSD License)

Copyright (c) 2012, toddb@goneopen.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies, 
either expressed or implied, of the FreeBSD Project.
