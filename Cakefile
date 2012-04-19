# This is a sample script for cake instead of rake [incomplete]

{spawn, exec}  = require 'child_process'

task 'server:start', "Starts test server on localhost:8888", ->
  app = spawn 'node', ['src/scripts/server/coffee.js', '8888']
  app.stdout.setEncoding "utf8"
  app.stdout.on 'data', (data) ->
    console.log data
    
task 'test:open', 'Open index.html', ->
  exec 'open', 'http://localhost:8888/orders/current', (err) ->
    console.log err
    
task  'docs', 'Create the documentation set', ->
  exec 'docco', 'src/scripts/*.js src/scripts/coffee/*.js src/scripts/rest-coffee/*.js', (err) ->
    console.log err