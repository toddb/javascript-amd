// TODO: modularise
_requires( 'underscore', function(u){ 
  _ = u
  
  var mime = {
    Json: 'application/json'
  }
  var response = {
    OK: 200
  }
  
  // setup the helpers in global namespace
  _.each(_.extend(mime,response), function(val, key){ window[key] = val})  
  
  // setup the jasmine.Spec methods in global namespace
  _.each(['returning', 'showing', 'gets'], function( val ){
    window[val] = function(){
      return jasmine.getEnv().currentSpec[val](arguments);
      if (isCommonJS) exports[val] = window[val];
    } 
  })

  // setup the jasmine.Env methods in global namespace
  _.each(['load'], function( val ){
    window[val] = function(desc, func){
      return jasmine.getEnv()[val](desc, func);
      if (isCommonJS) exports[val] = window[val];
    } 
  }) 
   
})()


var load = function(desc, func) {
  return jasmine.getEnv()['load'](desc, func);
};
if (isCommonJS) exports.load = load;

jasmine.Env.prototype.load = function(context, func) {
  var spec = new jasmine.Spec(this, this.currentSuite, context);
  this.currentSuite.add(spec);
  this.currentSpec = spec;
  
  // always load up the deferred with the expectation spies on a load
  this.beforeEach(function(){
    this.logger = jasmine.createSpy('deferred-spy-for-testing');
    this.expectations = []
    var that = this
    _requires( 'utils/deferredBefore', function(deferred){ 
        $.DEFAULT_DEFERRED = deferred(context, that.logger); 
    })()
  })
  
  this.afterEach(function(){
    $.DEFAULT_DEFERRED = null
  })
  
  if (func) {
    spec.runs(func);
  }
  
  spec.runs(function(){
    
      _requires( context, function(widget){ 
                 
        waitsFor(function(){
          return spec.logger.callCount >= spec.expectations.length
        }, 'all ' + spec.expectations.length + ' expectation(s) to be executed but only ' + spec.logger.callCount + ' completed')

        runs(function(){
          _(spec.expectations.length).times(function(){
            spec.expectations.shift()( context )
          })         
          $(widget).remove()              
        })

      })()
     
  });

  return spec;
};

jasmine.Spec.prototype.gets = function (args) {
  
  // TODO: cleanup this when needed
  var url = args[0]
    accept = args[1],
    status = args[2][0],
    responseText = args[2][1]
  
  $.mockjax( {
    url: url,
    type: 'GET',
    status: status || OK,
    headers: { Accept: accept || Json},
    responseText: responseText
  })
  
  var that = this
  this.expectations.push( function( context ){
    expect(that.logger).toHaveBeenCalledWith( [context, "GET", url, status] );
  })
  
  // var block = new jasmine.Block(this.env, func, this);
  // this.addToQueue(block);
  
  return this;
};

jasmine.Spec.prototype.showing = function (args) {
  var args = _.toArray(args)
  var that = this
  this.expectations.push( function( context ){
    expect(that.logger).toHaveBeenCalledWith( _.flatten([context, args]));
  })
}

jasmine.Spec.prototype.returning = function (args) {
  return _(args).map(function( val ){
    var ret
    if( _.isString(val) && val.match(/json!|html!|text!/)){
      _requires( val, function( r ){ 
          ret = r;
      })()
    } else {
      ret = val
    }
    return ret
  })
}

describe("functional test", function() {
  
  beforeEach(function() {
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD')
  });

  load('rest-coffee-deferred/main', function(){
      gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'))
      showing('text!coffee/views/index.html', 'text!coffee/views/_item.html', 'text!coffee/views/_new.html')
      gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json'))
      gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/1.json'))
      gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/1.json')) 
    }
  )

});