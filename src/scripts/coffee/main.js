define("coffee/main", ['utils/log', 'jquery', 'coffee/loader', 'date'], function( log, $, loader ){
  
  log.loader("coffee/main")
    
  $( function(){
    
    $('<div id="coffee">').appendTo('body')

    // TODO: refactor params to object literal
    loader.init('#coffee', 
      require('text!coffee/views/index.html'), 
      '#coffee-orders', 
      require('text!coffee/views/_item.html'), 
      require('coffee/link').get(), 
      "#coffee .order", 
      function(){ 
        var now = new Date();
        return { type: 'small', ordered: now.toUTCString() } 
      } 
    )

    log.debug('ensure all dates are formatted - attaching to class date')
    $(".date").easydate();
    
  })

  
});