describe("Loading rest coffee", function() {
  
  beforeEach(function(){ 
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD') 
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

  });
  
  describe("GET coffee and orders", function() {
    
    beforeEach( _requires(['rest-coffee/main']));
    
    it("should start by loading the link", function() {
      
       waitsFor( function(){
         return $('li').size() > 0
       })
       
       runs(function(){
         var val = $('li').size();
         $('button.order').click()
         expect($('li').size()).toEqual(val + 1);        
       })

     });
  });

  afterEach(function() {
    runs(function(){
      $.mockjaxClear();
      $('link[rel="collection"]').remove()  
      $('#coffee').empty()    
    })

  });
 
});