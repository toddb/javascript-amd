define("coffee/main", ['utils/log', 'jquery', 'coffee/loader'], function( log, $, loader ){
  
  log.loader("coffee/main")
    
  $( function(){
    
    $('<div id="coffee">').appendTo('body')

    loader.init({
      instructions: {
        id: '#coffee',
        tmpl: require('text!coffee/views/index.html')
      },
      orders: {
        id: '#coffee-orders',
        tmpl: require('text!coffee/views/_item.html'),
        items: require('coffee/link').get()
      },
      add: {
        id: '#coffee .order',
        click: function(){ 
          var now = new Date();
          return { type: 'small', ordered: now.toUTCString() } 
        }
      }
    })
    
  })

  
});