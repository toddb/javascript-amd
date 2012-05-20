define('rest-coffee/main',
  ['utils/log', 'jquery', 'underscore', 'utils/semanticLink', 'coffee/loader', 'utils/httpCall' ], 
  function( log, $, _, link, loader, httpCall ){
  
  log.loader("rest-coffee/main")
    
  $( function(){

     loader.init({
      instructions: {
        tmpl: require('text!coffee/views/index.html')
      },
      orders: {
        tmpl: require('text!coffee/views/_item.html')
      },
      add: {
        click: function(){ 
          var now = new Date();
          return { type: 'small', ordered: now.toUTCString() } 
        }
      }
     })

   })
  
  link
    .get('HEAD', 'collection', 'application/json')
    .done( function( content, status, settings ){
            
        $.when( _.map(content.orders, function( order ){
          return httpCall.get( order.href, order.type )
        }))
        .done( function( data ){
          _.each( data, function( entry ){
            entry
            .done( function( item, status, settings  ){
              $( function(){
                loader.add( item)
              })
            })
            .fail( function( jqXhr, status, message ){
              log.error( "Items error occured: %s - %s", status, message)
            })
          })
        })

    })
    .fail( function( jqXhr, status, message ){
       log.error( "HEAD collection error occurred: %s - %s", status, message )
    })
  
});