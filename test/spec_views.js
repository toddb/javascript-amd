describe("Html views", function() {
  var data = { type: "small", ordered: "1 min ago" }
  
  describe("Item", function() {
    beforeEach(_requires(["text!coffee/views/_item.html", 'jsrender'], function( text ){ 
      $( "#test" ).html( $.templates( text ).render( data ) );
    }));
    
    it("has a line item", function() {
      expect($("li", "#test" ).size()).toEqual(1);
    });
    
    it("has italised description", function() {
      expect($("li>i", "#test" ).text()).toEqual('small');
    });
    
    it("has bracketed date", function() {
      expect($("li:contains('(1 min ago)')", "#test" )).toBeTruthy()
    });
    
    afterEach(function() {
      $( "#test" ).empty()
    });
  });
  
  describe("Item - multiple", function() {
    beforeEach(_requires(["text!coffee/views/_item.html", 'jsrender'], function( text ){ 
      $( "#test" ).html( $.templates( text ).render( [data, data] ) );
    }));
    
    it("has a line item", function() {
      expect($("li", "#test" ).size()).toEqual(2);
    });
    
    afterEach(function() {
      $( "#test" ).empty()
    });
  });
  
  describe("Add item", function() {
    beforeEach(_requires(["text!coffee/views/_new.html", 'jsrender'], function( text ){ 
      $( "#test" ).html( $.templates( text ).render( [data] ) );
    }));
    
    it("has a size item", function() {
      var select = $("input[name='size']", "#test" )
      expect(select.size()).toEqual(1);
      expect(select.val()).toEqual("small");
    });
    
    afterEach(function() {
      $( "#test" ).empty()
    });    
  });
  
});