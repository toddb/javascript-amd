define(
  [ 'utils/log', 'jquery', 'underscore' ],
  function(log, $, _){
    
    var deferred = function( context, logger ){
      // construct a new deferred with our callbacks chained in
      // we could use pipes if it was existing too, but this will do for now
      // and it will get invoked first
      return $.Deferred( function(deferred){
        // add handler for each of the known promise callbacks
        _.each(['done', 'fail', 'progress'], function( handler ){
          deferred[handler]( function(){
            var args = _.toArray(arguments)
            // add handler and context as arguments to pass through
            _(args).unshift(handler).unshift(context || "")
            logger && logger.apply(this, args)
          })
        })
      })
    }
    
    return deferred
  
  }
);