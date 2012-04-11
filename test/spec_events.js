describe("Events - add order", function() {
  
  var data = { type: 'small', ordered: 'now' };
  
  beforeEach(_requires(["coffee/loader"], function( l ){ loader = l }));
  
  it("should be able to register add order handler", function() {
    spyOn(loader, 'order').andCallThrough()
    var callback = jasmine.createSpy();
    loader.orderHandler( $('#test'), callback )
    
    $('#test').click()
    
    expect(loader.order).toHaveBeenCalled()
    expect(callback).toHaveBeenCalled()
  });
  
  it("should save the order and update the view to the customer", function() {
    var link = require('coffee/link')
    
    spyOn(link, 'set').andCallThrough()
    spyOn($, 'observable').andCallThrough()
    
    loader.order.call( link, data )

    expect(link.set).toHaveBeenCalledWith( data, jasmine.any(Function) )
    expect($.observable).toHaveBeenCalled()   
  });
  
});