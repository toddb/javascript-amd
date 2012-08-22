
describe("Promise-FIT, loading rest coffee", function() {
	
  beforeEach(function() {
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD')
  });


  load(['rest-coffee-promise/main', 'add order'], function(){
   
   
   		  gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'));
   	    showing('text!coffee/views/index.html', 'text!coffee/views/_item.html', 'text!coffee/views/_new.html');
   	    gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json'));
   	    gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/1.json'));
   	    gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/1.json'));
   
   	    using(function(){
   
   	        $('button.order', this.widget).click()
   	        expect($('#new-coffee', this.widget).is(':visible')).toBeTruthy();
   
   	        $( 'input', $('#new-coffee')).val('small');  
   	        $( ':submit', $('#new-coffee')).click();	   
   	    })
   
   			_$('#new-coffee')
   	  	became(':hidden')
   	  	was('clicked')
   		
   	    posts('http://localhost:8888/orders', Json, returning(OK, { Location: 'http://localhost:8888/orders/4'}));
   	    gets('http://localhost:8888/orders/4', Json, returning(OK, 'json!server/orders/1.json'));
   
     }
   )
	
	load(['rest-coffee-promise/main', 'delete order'], function(){
	
	  	gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'));
	    gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json'));
	    gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/1.json'));
	    gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/1.json'));
	
	    using(function(){
					waitsFor(function(){
						return $('ul#coffee-orders>li').size() >= 3
					}, "waiting for the three orders to be rendered")
	    })			
	})
	
  afterEach(function () {
      $('link[rel="collection"]').remove()
  });
  
});
