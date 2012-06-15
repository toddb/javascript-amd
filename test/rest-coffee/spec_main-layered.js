describe("Loading rest coffee", function() {
  
  var widget
  
  beforeEach(function(){ 
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD') 
    
    // response for the collection
    $.mockjax({
      url: '*/orders/current',
      type: 'GET',
      headers: { 'Accept': 'application/json' },
      responseText: require('json!server/orders/current.json')
    })
    
    // return for (same response text)
    // * http://localhost:8888/orders/1
    // * http://localhost:8888/orders/2
    // * http://localhost:8888/orders/3
    $.mockjax({
      url: '*/orders/*',
      type: 'GET',
      headers: { 'Accept': 'application/json' },
      responseText: require('json!server/orders/1.json')
    })

    // match on the url from the collection http://localhost:8888/orders
    $.mockjax({
      url: '*/orders',
      type: 'POST',
      responseText: require('json!server/orders/1.json'),
       // and return Location header http://localhost:8888/orders/4 of the created resource
      headers: {'Location': 'http://localhost:8888/orders/4' },
      async: false
    });
    
  });
  
  describe("Loading and displaying current orders", function() {
    
    var orders, original_orders
    
    beforeEach( _requires(['rest-coffee-layered/main'], function(main){ widget = main }) );
    
    describe("Load up and click to enter new", function() {
      
      beforeEach(function() {

         waitsFor( function(){
           orders = $('li').size()
           return orders == 3
         })

         runs(function(){
           original_orders = $('li').size();  
           // click the button
           $('button.order').click() 
           // and the new order is displayed
           expect($('#new-coffee').is(':visible')).toBeTruthy();   
           // with no new orders added
           expect($('li').size()).toEqual(original_orders);
        })
        
        
      });
      
      it("Add new", function() {
        // select a new order
        $( 'input', $('#new-coffee')).val('small')         
        // submit
        $( ':submit', $('#new-coffee')).click()

        waitsFor( function(){
          // new order is added 
          return $('li').size() == orders + 1
        })

        runs(function(){
          // and we've hidden the form
          expect($('#new-coffee').is(':visible')).toBeFalsy();         
          // and added the order
          expect($('li').size()).toEqual(original_orders+1);        
        })

      });
      
    });

  });

  afterEach(function() {
    runs(function(){
      $.mockjaxClear();
      $('link[rel="collection"]').remove()  
      widget.teller('destroy')
    })

  });
 
});