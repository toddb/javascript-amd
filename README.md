= Sample for javascript AMD

There are presentation notes about this code at: http://www.slideshare.net/toddbr/javascript-firstclass-citizenery

== DESCRIPTION:

Sample code in javascript to demonstrate the requirejs library (using node.js) and jasmine for BDD-style testing.

It demonstrates test-driven client-side Javascript development, including linting & validation, merging, and minification.

It also demonstrates different types of testing: testing plain html, events and mocking.

== FEATURES/PROBLEMS:

* to run tests and src/app.html you first need to build so that html is wrapped

== TODO:

* setup node.js as out-of-process localhost for serving up html files
* write this app using a REST style

== SYNOPSIS:


Use rake to see all tasks. Key tasks are build, test:acceptance and test:specs

	$ rake -T
	rake all              # Build and release
	rake build            # Create the release [default]
	rake build:clean      # Removes files from dist and build
	rake build:compile    # Builds javascript through node.js
	rake build:copy       # Copies files to the dist folder
	rake clobber          # Removes all files from build and release
	rake release          # Build and release to server using upload.sh - (not che...
	rake release:clean    # Cleans release folder
	rake release:prepare  # Creates the release folder
	rake test             # Opens all tests and examples in browser
	rake test:acceptance  # Run acceptance test in browser
	rake test:example     # Show example
	rake test:node        # Run spec tests in node.js
	rake test:specs       # Run spec tests in browser


== REQUIREMENTS:

The app uses 

 - ruby (currently using 1.8.7)
 - rake (currently 0.8.7)
 - node.js (currently 0.5.0)

Tested on Max OSX with Mozilla 8 and Chrome 17.

== BUILDING

$ rake build

== RELEASING

* create an upload.sh file that will release to your environment
* all release files in dist/

$ rake release

== LICENSE:

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
