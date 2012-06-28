define( 
  [ 'utils/log', 'underscore' ],
  function(log, _){
    
    log.loader("utils/deferredBefore")
    
    _.mixin({
      
      isResponse: function( obj ){
        return obj &&  _.isFunction(obj.setRequestHeader)
      },
      
      flattenResponse: function( res ){
         return _(res).map(function(arg){ 
           if (_.isResponse(arg)) return arg.status
           if (_.isArray(arg)) return _.filter( arg, function( val) { return _.isString(val) } )
        }) 
      },
      
      isRequest: function( obj ){
        return obj && _.isFunction(obj.xhr)
      },
      
      flattenRequest: function( req ){
        return _.isRequest(req) ?  [req.type, req.url] : null       
      },
      
      flattenDeferred: function(){
        return _(arguments).chain()
          .flatten()
          .compact()
          .unique()
          .value()
      },  
      
      mergeDeferred: function(context, request, response){
        return _.flattenDeferred(context, _.flattenRequest(request), _.flattenResponse(response))
      }
      
    });
    
    var deferred = function( context, logger ){
      return function(deferred){
        // add handler for each of the known promise callbacks
        _.each(['done', 'fail', 'progress'], function( handler ){
          deferred[handler]( function(){
            logger && logger(_.mergeDeferred( context, this, arguments))
          })
        })
      }
    }
    
    // TODO: this requires init, clear & set - to link it into the jQuery
    
    return deferred
  
});