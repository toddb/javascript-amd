describe("Promise functional test", function() {
  
  beforeEach(function() {
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD')
  });

  load('rest-coffee-deferred/main', function(){
      gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'))
      showing('text!coffee/views/index.html', 'text!coffee/views/_item.html', 'text!coffee/views/_new.html')
      gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json'))
      gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/1.json'))
      gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/1.json')) 
    }
  )

});