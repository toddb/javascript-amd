var logger = jasmine.createSpy('logger'), 
  _,
  request,
  context,
  expectations = []
  
_requires( 'underscore', function(u){ _ = u })()

function check(){
  
  var deferred, 
    widget, 
    context = arguments[0];
  
  _requires( 'utils/deferredBefore', function(deferred){ 
      $.DEFAULT_DEFERRED = deferred(context, logger); 
  })()

  _requires( context, function(w){ 
      widget = w
  })()
  
  waitsFor(function(){
    return logger.callCount >= expectations.length
  }, 'all ' + expectations.length + ' expectation(s) to be executed but only ' + logger.callCount + ' completed')
  
  runs(function(){
    _(expectations.length).times(function(){
      expectations.shift()( context )
    })

    $(widget).remove()    
  })
  
}

var OK = 200;
var Json = 'application/json';

function GET(){
  var url = arguments[0]
    accept = arguments[1],
    status = arguments[2][0],
    responseText = arguments[2][1]
  
  $.mockjax( {
    url: url,
    type: 'GET',
    status: status || OK,
    headers: { Accept: accept || Json},
    responseText: responseText
  })
  
  expectations.push( function( context ){
    expect(logger).toHaveBeenCalledWith( [context, "GET", url, status] );
  })
  
}

function returns(){
  return _(_.toArray(arguments)).map(function( val ){
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

function shows(){
  var args = _.toArray(arguments)
  expectations.push( function( context ){
    expect(logger).toHaveBeenCalledWith( _.flatten([context, args]));
  })
}

describe("functional test", function() {
  
  beforeEach(function() {
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD')
  });

  it("should resolve with - code with comments and extra code", function() {
    check(
      'rest-coffee-deferred/main',
      GET('http://localhost:8888/orders/current', Json, returns(OK, 'json!server/orders/current.json')),
      shows('text!coffee/views/index.html', 'text!coffee/views/_item.html', 'text!coffee/views/_new.html' ),
      GET('http://localhost:8888/orders/1', Json, returns(OK, 'json!server/orders/1.json')),
      GET('http://localhost:8888/orders/2', Json, returns(OK, 'json!server/orders/1.json')),
      GET('http://localhost:8888/orders/3', Json, returns(OK, 'json!server/orders/1.json'))
    )
  });

  // short-hand versions if needed
  // xit("should resolve with - code with comments and extra code -- short version", function() {
  //   check(
  //     'rest-coffee-deferred/main',
  //     GET('*/orders/current', returns('json!server/orders/current.json')),
  //     shows('text!coffee/views/index.html')
  //   )
  // });

});