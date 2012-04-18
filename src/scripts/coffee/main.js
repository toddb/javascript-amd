define("coffee/main", ['utils/log', 'jquery', 'coffee/loader'], function( log, $, loader ){
  
  log.loader("coffee/main")
    
  $( function(){
    
    loader.init({
      instructions: {
        tmpl: require('text!coffee/views/index.html')
      },
      orders: {
        tmpl: require('text!coffee/views/_item.html'),
        items: require('coffee/link').get()
      },
      add: {
        click: function(){ 
          var now = new Date();
          return { type: 'small', ordered: now.toUTCString() } 
        }
      }
    })
    
  })

  
});