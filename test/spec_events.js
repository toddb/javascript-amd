describe("Events - add order", function() {
  
  var data = { type: 'small', ordered: 'now' };
  
  beforeEach(_requires(["coffee/loader"], function( l ){ loader = l }));
  
  it("should be able to register add order handler and have it invoked on click", function() {
    spyOn(loader, 'order').andCallThrough()
    var callback = jasmine.createSpy().andReturn( data);
    var success = jasmine.createSpy();
    loader.orderHandler( $('#test'), callback, success )
    
    $('#test').click()
    
    expect(loader.order).toHaveBeenCalledWith( data )
    expect(callback).toHaveBeenCalled()
    expect(success).toHaveBeenCalled()
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