describe("Events - add order", function() {
  
  var data = { type: 'small', ordered: 'now' };
  
  beforeEach(_requires(["coffee/loader"], function( l ){ loader = l }));
  
  it("should be able to register add order handler for a FORM and have it invoked on click", function() {
    
    $('<form id="handler">').appendTo('#test')
    spyOn(loader, 'add').andCallThrough()
    var callback = jasmine.createSpy().andReturn( data );
    var success = jasmine.createSpy();
    loader.orderHandler( '#test', callback, success )
    
    $('#handler').submit()
    
    expect(loader.add).toHaveBeenCalledWith( data )
    expect(callback).toHaveBeenCalled()
    expect(success).toHaveBeenCalled()
  });
    
  it("should save the order and update the view to the customer", function() {
    var link = require('coffee/link')
    spyOn($, 'observable').andCallThrough()
    
    loader.add.call( link, data )

    expect($.observable).toHaveBeenCalled()   
  });
  
});