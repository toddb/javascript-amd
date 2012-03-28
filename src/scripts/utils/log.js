define('utils/log', function(){
  
  // adding guard for console - from http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
  if (Function.prototype.bind && console && typeof console.log == "object") {
      [
        "log","info","warn","error","assert","dir","clear","profile","profileEnd"
      ].forEach(function (method) {
          console[method] = this.bind( console[method], console );
      }, Function.prototype.call);
  }
    
  var logger = {
    
    debug: function(){
      console.log.apply( console, arguments )
    },
    
    loader: function( obj ){
      console.log( "loading: %s", obj )
    }
  }
  
  logger.loader( "log" )
    
  return logger

})