describe("Http Call", function() {
  
  var httpCall, onFailure, onSuccess;
  
  beforeEach( _requires(['utils/httpCall'], function(l){ 
    httpCall = l 
    onFailure = jasmine.createSpy();
    onSuccess = jasmine.createSpy();
  }));
  
  describe("POST failure", function() {
    
    it("should trigger failure callback", function() {
      $.mockjax({
        url: '*',
        type: 'POST',
        status: 500
      });      
    });
    
    it("should trigger failure callback with url not found", function() {
        $.mockjax({
          url: 'http://not-found',
          type: 'POST',
        });
    });

    it("should trigger failure callback with url not found because the server returned 404", function() {
        $.mockjax({
          url: 'http://httpCall-POSTtest',
          type: 'POST',
          status: 404
        });
    });
        
    afterEach(function() {
       // note: using dataType correctly from jQuery
       httpCall
        .post('http://httpCall-POSTtest', {}, 'json')
        .fail( onFailure )
        .done( onSuccess )

       waitsFor(function() {
         return onFailure.wasCalled;
       });
       
       runs(function(){
         expect(onSuccess).not.wasCalled();
         $.mockjaxClear();          
       })
    })
    
  });


  describe("POST success", function() {

    it("should trigger success callback", function() {
       $.mockjax({
         url: 'http://httpCall-POSTtest',
         type: 'POST',
         responseText: { me: "this"},
         async: false
       });
    });
    
    afterEach(function() {
      httpCall
       .post('http://httpCall-POSTtest', {}, 'json')
       .fail( onFailure )
       .done( onSuccess )

       waitsFor(function() {
         return onSuccess.wasCalled;
       });

       runs(function(){
         expect(onFailure).not.wasCalled();         
         $.mockjaxClear();          
       })
  
    });

  });
  
  describe("GET failure", function() {

     it("should trigger failure callback", function() {
       $.mockjax({
         url: '*',
         status: 500
       });
     });
     
     it("should trigger failure callback with url not found", function() {
        $.mockjax({
          url: 'http://not-found'
        });
     });
     
     it("should trigger failure callback with accept not found", function() {
        $.mockjax({
          url: '*',
          headers: { "Accept": 'application/json' }
        });
     });
     
     it("should trigger failure callback with accept not found on response", function() {
        $.mockjax({
          url: '*',
          response: function( settings ){
            if (this.headers['Accept'] !== 'application/json'){
              this.status = 500
            }
          }
        });
     });
      
     afterEach(function() {
        httpCall
         .get('http://httpCall-test', 'text/html')
         .fail( onFailure )
         .done( onSuccess )

        waitsFor(function() {
          return onFailure.wasCalled;
        });
        
        runs(function(){
          expect(onSuccess).not.wasCalled();
          $.mockjaxClear();          
        })
      
     });

   });

   describe("GET success", function() {

     it("should trigger success callback", function() {
        $.mockjax({
          url: '*'
        });
     });

     it("should trigger success callback with accept headers", function() {
        $.mockjax({ 
          url: '*',
          headers: { 'Accept': 'text/html' }
        });
     });

     it("should trigger success callback with customer callback on accept headers", function() {
        $.mockjax({
          url: '*',
          headers: { 'Accept': 'text/html' },
          headerCheck: function( requestHeaders, serverHeaders ){
             return requestHeaders['Accept'] == serverHeaders['Accept']
          }
        });
     });

     it("should trigger success callback with customer callback on accept headers changed in response", function() {
        $.mockjax({
          url: '*',
          response: function( settings ){
            if (this.headers['Accept'] !== 'text/html'){
              this.status = 500
            }
          }
        });
     });     
     
     afterEach(function() {
       httpCall
        .get('http://httpCall-test', 'text/html')
        .fail( onFailure )
        .done( onSuccess )

        waitsFor(function() {
          return onSuccess.wasCalled;
        });

        runs(function(){
          expect(onFailure).not.wasCalled();         
          $.mockjaxClear();          
        })
   
     });

   });
    
});