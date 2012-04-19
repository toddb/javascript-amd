require 'rubygems' unless ENV['NO_RUBYGEMS']
require 'fileutils'
open = /mswin|mingw/ =~ RUBY_PLATFORM ? 'start' : 'open'


task :default => [:build]

desc "Create the release [default]"
task :build => ["build:clean", "build:prepare", "build:compile", "build:copy"]

desc "Build and release"
task :all => [:clobber, :build, :release]

desc "Removes all files from build and release"
task :clobber => ["build:clean", "release:clean", "docs:clean"]

namespace :build do
  desc "Removes files from dist and build"
  task :clean do
    FileUtils.rm_r Dir.glob('dist') rescue nil
    FileUtils.rm_r Dir.glob('build') rescue nil
  end

  task :prepare do
    FileUtils.mkdir_p %w(dist dist/css dist/scripts dist/images)
    FileUtils.mkdir_p %w(build build/css build/scripts build/images)
  end

  desc "Builds javascript through node.js"
  task :compile do
    sh %{ node lib/r.js -o app.build.js }
  end

  desc "Copies files to the dist folder"
  task :copy do
    FileUtils.cp 'build/app-dist.html',           "dist/app.html", :verbose => true
    # TODO - this should really be screen-min
    FileUtils.cp_r 'build/css/screen.css',        "dist/css/screen.css", :verbose => true

    FileUtils.cp 'build/scripts/coffee/main.js', "dist/scripts/main-min.js", :verbose => true
    # FileUtils.cp 'build/scripts/coffee/loader.js', "dist/scripts/loader-min.js", :verbose => true
    FileUtils.cp 'build/scripts/bootstrap.js',    "dist/scripts/bootstrap-min.js", :verbose => true
    FileUtils.cp 'build/scripts/bootstrap-html.js',    "dist/scripts/bootstrap-html-min.js", :verbose => true

    FileUtils.cp_r 'build/images',                "dist", :verbose => true 

    FileUtils.cp_r 'README.md',                  "dist", :verbose => true 

    FileUtils.rm_r Dir.glob('dist/**/.svn')
    FileUtils.rm_r Dir.glob('dist/**/.DS_Store')
  end
end

desc "Opens all tests and examples in browser"
task :test => ["test:acceptance", "test:specs", "test:example"]

namespace :test do
    
  desc "Run acceptance test in browser"
  task :acceptance => "build:compile" do
    `#{open} dist/app.html`
  end

  desc "Run spec tests in browser"
  task :specs do
    `#{open} test/SpecRunner.html`
  end

  desc "Show example"
  task :example do 
    `#{open} src/app.html`
  end 
  
  desc "Run spec tests in node.js"
  task :node => ['build:compile'] do
     `lib/node-jasmine-dom/bin/jasmine-dom --runner test/SpecRunner.html`
  end
  
  desc "Run the example against the server"
  task :server do
    `#{open} http://localhost:8888/orders/current`
  end
end

desc "Build and release to server using upload.sh - (not checked in)"
task :release => ["release:clean", "release:prepare"] do

    # This is an example of my basic upload.sh file that is specific to my environment

    # #!/usr/bin/env bash

    #  cd dist
    #  scp -r * user@myserver.com:/home/user/myapp.mydomain.com

    #  echo "Copying the archive across"
    #  zip -r ../release/app.zip .
    #  scp ../release/app.zip user@myserver.com:/home/user/myapp.mydomain.com

    #  # add redirect in the apache environment
    #  echo "DirectoryIndex app.html" > .htaccess
    #  scp -r .htaccess user@myserver.com:/home/user/myapp.mydomain.com
    #  cd ..

  sh %{ ./upload.sh }
end

namespace "release" do
  desc "Cleans release folder"
  task :clean do
    FileUtils.rm_r Dir.glob('release') rescue nil
  end

  desc "Creates the release folder"
  task :prepare do
    FileUtils.mkdir_p %w(release)
  end
end

namespace "server" do

  node = /mswin|mingw/ =~ RUBY_PLATFORM ? 'node.exe' : 'node'

  desc "Starts test server on localhost:8888"
  task :start do
    `#{node} src/scripts/server/coffee.js 8888`
  end
end

namespace :docs do 
  desc "Create the documentation set"
  task :compile do
    `docco src/scripts/*.js src/scripts/coffee/*.js src/scripts/rest-coffee/*.js src/scripts/utils/*.js`
  end
  
  "Clean the documentation set"
  task :clean do
    FileUtils.rm_r Dir.glob('docs') rescue nil    
  end
  
  desc "Opens the documentation in a browser"
  task :open do
    `#{open} docs/bootstrap.html`
  end
end

