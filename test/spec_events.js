describe("Events - add order", function() {
  
  var data = { type: 'small', ordered: 'now' };
  
  beforeEach(_requires(["coffee/loader"], function( l ){ loader = l }));
  
  it("should be able to register add order handler for a FORM and have it invoked on click", function() {
    
    $('<form id="handler">').appendTo('#test')
    spyOn(loader, 'add').andCallThrough()
    var promise = jasmine.createSpy().andReturn( data );

    loader.orderHandler( '#test', promise )
    
    $('#handler').submit()
    
    expect(loader.add).toHaveBeenCalledWith( data )
    expect(promise).toHaveBeenCalled()
  });
    
  it("should save the order and update the view to the customer", function() {
    var link = require('coffee/link')
    spyOn($, 'observable').andCallThrough()
    
    loader.add.call( link, data )

    expect($.observable).toHaveBeenCalled()   
  });
  
});