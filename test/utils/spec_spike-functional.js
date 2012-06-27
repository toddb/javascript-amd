// these aren't used but notes about the ways in which we could have written the tests
xdescribe("Deferred promise", function() {
    
  it("should resolve with", function() {
    
      check(
        function(){
          _requires(['rest-coffee-layered/main']
        },
        GET('*/orders/current', 'application/json', { error: 'Collection resource needed'}),
        OK(200, require('json!server/orders/current.json')),
        shows('instructions')
      )

  });
  
  it("should resolve with", function() {
    
      $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD') 
 
      check(
        // ui widget to be loaded - it should self initialise from the link above
        'rest-coffee-layered/main',
        // these are the expected results and mocks at the same time - and need to be called in order
        // GET, POST, PUT, DELETE as requests and OK ... as responses
        GET('*/orders/current', 'application/json', { error: 'Collection resource needed'}),
        OK(200, require('json!server/orders/current.json')),
        // we should see instructions loaded on the screen
        // in fact, we don't look for actual elements on the screen but rather that the log was called
        // because rendering will be deferred and must be done after the 
        shows('instructions')
      )

  });
  
  it("should resolve with", function() {
    
      check(
        'rest-coffee-layered/main',
        ["GET */orders/current application/json", 'Collection resource needed'],
        ["OK 200", require('json!server/orders/current.json')],
        "shows instructions"
      )

  });
  

});