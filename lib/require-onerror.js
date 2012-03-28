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