define('require-onerror', ['requirejs'], function( ){
  
  return {
    
    init: function(){
      // Basic error reporting for tests to better locate the error
      // TODO: update so that it works in Chrome. Works well in Firefox
      require.onError = function (err) {
          if (console) {
              if (console.error) {
                  console.error('Require error:\n\n', err.toString());
                  console.error(err);
              } else {
                  console.log('Require error:\n\n', err.toString());
                  console.log(err);
              }
          }
      };     
    }
  }
  
})


// // Patch Jasmine for proper stack traces
// jasmine.Spec.prototype.fail = function (e) {
//   var expectationResult = new jasmine.ExpectationResult({
//     passed: false,
//     message: e ? jasmine.util.formatException(e) : 'Exception'
//   });
//   // PATCH
//   if (e) {
//     expectationResult.trace = e;
//   }
//   this.results_.addResult(expectationResult);
// };