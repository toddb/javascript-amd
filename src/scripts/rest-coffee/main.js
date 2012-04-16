define('rest-coffee/main',
  ['utils/log', 'jquery', 'utils/semanticLink', 'coffee/loader', 'utils/httpCall' ], 
  function( log, $, link, loader, httpCall ){
  
  log.loader("rest-coffee/main")
    
  $( function(){
    
    link
      .get('HEAD', 'collection', 'application/json')
      .done( function( links, status, settings ){
        
        $('<div id="coffee">').appendTo('body')
              
        // TODO: this is so wrong
        $.each(link.filter( links, "item", "application/json"), function(){
 
          httpCall
            .get( this.href, this.type)
            .done( function( item, status, settings ){
              loader.add( item.data )
            })
            .fail( function( jqXhrf, status, message ){
               log.error( arguments )
            } )         
        })

         loader.init({
           instructions: {
             id: '#coffee',
             tmpl: require('text!coffee/views/index.html')
           },
           orders: {
             id: '#coffee-orders',
             tmpl: require('text!coffee/views/_item.html')
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
      .fail( function( jqXhrf, status, message ){
         log.error( arguments )
      })
  
  })
  
});