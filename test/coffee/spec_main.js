describe("First test that loads main", function() {

  beforeEach(_requires(["coffee/main"]));
    
  it("should be able to add new order", function() {   
    // note: I had to patch jsviews-1.0pre and put guard in to avoid error "no method 'removeViews'" 
    var val = $('li', '#coffee-orders').size();
    $('button.order', '#coffee-orders').click()
    expect($('li', '#coffee-orders').size()).toEqual(val++);
  });
  
  afterEach(function() {
    $( '#coffee' ).empty()
  });
  
});