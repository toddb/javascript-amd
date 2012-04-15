define('rest-coffee/main',
  ['utils/log', 'jquery', 'utils/semanticLink', 'utils/httpCall' ], 
  function( log, $, link, httpCall ){
  
  log.loader("rest-coffee/main")
    
  $( function(){
    
    // link.filter('HEAD')
    httpCall.get('http://localhost/')
    httpCall.get('http://localhost/', "application/json")
   
 
  })

  
});