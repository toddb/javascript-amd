define('coffee/link', ['utils/log'], function( log ){
  
  log.loader('coffee/link');

  function fakeGet(){
    
    // TODO: this will do for now
    var now = new Date()
    now.setSeconds(now.getSeconds() - 10)
    var tensecondsago = now.toUTCString();
    now.setMinutes(now.getMinutes() - 1)
    var oneminuteago = now.toUTCString();
    now.setMinutes(now.getMinutes() - 9)
    var tenminutessago = now.toUTCString();
    
    return [
    	{ type: "small", ordered: tensecondsago },
    	{ type: "small", ordered: oneminuteago },
    	{ type: "small", ordered: tenminutessago }
    ]
  }
  
  function ajaxSet( val, success){
    log.debug("update!")
    success( val )
  }
  
  return {
    get: fakeGet,
    set: ajaxSet
  }
})
