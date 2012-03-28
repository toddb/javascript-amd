describe("Events - add order", function() {
  console.log("bbba")
  
  var data = { type: 'small', ordered: 'now' };
  
  beforeEach(_requires(["coffee/loader"], function(){ _ = arguments[0] }));
  
  it("should be able to register add order handler", function() {
    spyOn(_, 'order').andCallThrough()
    _.orderHandler( $('#test'), function(){ return data } )
    
    $('#test').click()
    
    expect(_.order).toHaveBeenCalled()
  });
  
  it("should save the order and update the view to the customer", function() {
    link = require('coffee/link')
    
    spyOn(link, 'set').andCallThrough()
    spyOn($, 'observable').andCallThrough()
    
    _.order( data, link  )
    
    expect(link.set).toHaveBeenCalled()
    expect($.observable).toHaveBeenCalled()   
  });
  
});