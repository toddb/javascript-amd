define( 
  [ 'utils/log', 'jquery', 'underscore' ],
  function(log, $, _){
    
    log.loader("utils/deferred")

    _.mixin({
      mergeToArray: function(){
        return _(arguments).chain()
          .map( function( val ){  return _.isArguments(val) ? _(val).toArray() : val })
          .flatten()
          .compact()
          .value()
      }
    });
        
    var deferred = function( context, logger, old_deferred ){
      // construct a new deferred with our callbacks chained in
      // we could use pipes if it was existing too, but this will do for now
      // and it will get invoked first
      return (old_deferred || $.Deferred)( function(deferred){
        // add handler for each of the known promise callbacks
        _.each(['done', 'fail', 'progress'], function( handler ){
          deferred[handler]( function(){
            logger && logger.apply(this, _.mergeToArray( context, handler, arguments ))
          })
        })
      })
    }
    
    return deferred
  
  }
);