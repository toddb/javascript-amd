describe("Deferred promise", function() {
  
  var result, when, _;
  
  beforeEach(_requires(['utils/deferred', 'utils/when', 'underscore'], function(d, w, u){ result = d; when = w; _=u }));
  
  it("should return deferred object", function() {
    expect($.Deferred).toMatch(result());
  });
  
  it("should resolve with", function() {
    
    var ok = jasmine.createSpy();
    
    when( sync() )
      .done( function(){
        ok()
      });
    
    function sync(){
      return result().resolve()
    }  
    
    expect(ok).toHaveBeenCalled();
  });

  
  it("should resolve with and have context", function() {
    
    var ok = jasmine.createSpy();
    
    when( sync(), "context" )
      .done( function(){
        ok()
      });
    
    function sync(){
      return result().resolve()
    }  
    
    expect(ok).toHaveBeenCalled();
  });

  
  it("should resolve with and have context", function() {
        
    var ok = jasmine.createSpy();
    var fail = jasmine.createSpy();
    
    $.when( sync())
      .done( function( data ){
        ok()
      })
      .fail( function(){
        fail()
      });
    
    function sync(){
      return result().resolveWith(this, ["bla1"] )
    }  

    function secondsync(){
      return result().resolveWith("secondSync",["bla2"])

    }
        
    expect(ok).toHaveBeenCalled();
   // expect(ok).toHaveBeenCalledWith( "secondSync" );
    // expect(fail).toHaveBeenCalled();
  });  
  
  it("should have callbacks", function() {
     var ok = jasmine.createSpy();
     
     var mylist = jQuery.Callbacks( "memory" )
     
     t = function(val){ ok(val); console.log("t:"+val)}
     j = function(val){ console.log("j:"+val)}
     z = function(val){ console.log("z:"+val)}
     rd = function(val){ console.log("roger-done:"+val)}
     rf = function(val){ console.log("roger-fail:"+val)}
     rp = function(val){ console.log("roger-progress:"+val)}
     
     subscribe = mylist.add
     publish = mylist.fire
     
     subscribe( [t, j, t] );
     
     var dfd = $.Deferred( function(d){
       d.done( function(){ console.log("DONE: ", arguments)})
       d.fail( function(){ console.log("FAIL: ", arguments)})
     });
     dfd.done( publish )

     var dfd2 = $.Deferred( function(d){
        d.done( function(){ console.log("DONE: ", arguments)})
        d.fail( function(){ console.log("FAIL: ", arguments)})
      });
      dfd2.done( publish )
      
      $.when( dfd, dfd2 )
        .done( function(){ console.log("WHEN: done, ", arguments)}, function(){ console.log("WHEN: done, ", arguments)})
        .then( [rd, rd], [rf,rf], rp)
      
        dfd.resolve( 'er' )
        dfd2.reject( 'erject' )
     
     subscribe( z )
     expect(ok).toHaveBeenCalledWith('er');
     
  });

  it("should be able to pipe", function() {
     var ok = jasmine.createSpy();
     
     var mylist = jQuery.Callbacks( "memory" )
     
     t = function(val){ ok(val); console.log("t:", arguments)}
     j = function(val){ console.log("j:", arguments)}
     z = function(val){ console.log("z:", arguments)}
     rd = function(val){ console.log("roger-done:", arguments)}
     rf = function(val){ console.log("roger-fail:", arguments)}
     rp = function(val){ console.log("roger-progress:", arguments)}
     
     subscribe = mylist.add
     publish = mylist.fire
     
     subscribe( [t, j, t] );
     
     var dfd = $.Deferred( function(d){
       d.context = "Pipe"
     })

     dfd.done( publish )
     
     dfd.pipe( 
        function(){ console.log("DONE-pipe: ", arguments, this.context)},
        function(){ console.log("FAIL-pipe: ", arguments, this)},
        function(){ console.log("PROGRESS-pipe: ", arguments)}
     )

     var dfd2 = $.Deferred( function(d){
        d.context = "Constuctor"
        d.done( function(){ console.log("DONE1-constructor: ", arguments)})
        d.done( function(){ console.log("DONE2-constructor: ", arguments)})
        d.done( function(){ console.log("DONE3-constructor: ", arguments)})
        d.fail( function(){ console.log("FAIL1-constructor: ", arguments, this.context)})
        d.fail( function(){ console.log("FAIL2-constructor: ", arguments, this.context)})
        d.fail( function(){ console.log("FAIL3-constructor: ", arguments, this.context)})
      });
      
      dfd2.pipe( function(){ console.log("DONE-pipe: ", arguments, this.context)},
      function(){ console.log("FAIL-pipe: ", arguments, this.context)},
      function(){ console.log("PROGRESS-pipe: ", arguments)}
         )
      dfd2.done( publish )
      
      $.when( dfd, dfd2 )
        .done( function(){ console.log("WHEN: done, ", arguments)}, function(){ console.log("WHEN: done, ", arguments)})
        .then( [rd, rd], [rf,rf], rp)
      
        dfd.resolve( 'er' )
        dfd2.reject( 'erject' )
     
     subscribe( z )
     expect(ok).toHaveBeenCalledWith('er');
     
  });
  
  it("should log events", function() {
    
    var logger = function(){
      console.debug( arguments )
    }
    
    spyOn(console, 'debug').andCallThrough();
        
    var dfd = result("Checker", logger )
    
    dfd.done( function(){ logger("in done")} )
    dfd.resolve( 're' )
    
    expect(console.debug).toHaveBeenCalledWith(['Checker', 'done', 're']);
    expect(console.debug).toHaveBeenCalledWith(["in done"]);
    
    
  }); 
  
  it("should log events - logger", function() {
    
    var logger = jasmine.createSpy('logger')
        
    var dfd = result("Checker", logger )
    
    dfd.done( function(){ logger('in done')} )
    dfd.resolve( 're' )
    
    expect(logger.callCount).toEqual(2);
    
    /* this will fail because jasmine calls contains rather than equality */
    // expect(logger).toHaveBeenCalledWith(['Checker', 'done', 're'], ['in done']);
    expect(logger).toHaveBeenCalledWith('Checker', 'done', 're');
    expect(logger).toHaveBeenCalledWith("in done");
    
    expect(logger.calls[0].args).toEqual(['Checker', 'done', 're']);
    expect(logger.calls[1].args).toEqual(['in done']);
    
    
  }); 
});