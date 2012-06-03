define('rest-coffee/main',
  ['utils/log', 'jquery', 'underscore', 'utils/semanticLink', 'coffee/loader', 'utils/httpCall' ], 
  function( log, $, _, link, loader, httpCall ){
  
  log.loader("rest-coffee/main")
    
  $( function(){
     var ordersRepresentation;

     loader.init({
      instructions: {
        tmpl: require('text!coffee/views/index.html')
      },
      orders: {
        tmpl: require('text!coffee/views/_item.html')
      },
      newOrder: {
        tmpl: require('text!coffee/views/_new.html')
      },
      add: {
        click: addOrderPromise
      },
     })

   })
   
  function addOrderPromise( order ){
     var result = new $.Deferred();
     link
         .post(ordersRepresentation, 'collection', '*', order, 'json')
         .done(function (content, status, settings) {
             var orderUrl = settings.getResponseHeader('Location');
             log.debug('Order created at ' + orderUrl);
             // Get the order
             httpCall
                 .get(orderUrl, 'application/json')
                 .done(function (order, statusText, jqXhrOk) {
                     log.debug('Query new order suceeded');
                     result.resolveWith(this, [order, statusText, jqXhrOk]);
                 })
                 .fail(function (jqXhrf2, status2, message) {
                     result.rejectWith(this, [jqXhrf2, status2, message]);
                 });
         })
         .fail(function (jqXhrf1, status1, message) {
             result.rejectWith(this, [jqXhrf1, status1, message]);
         });
     return result.promise();   
  }

  
  // TODO: I think this actually should return a promise with the collection resource
  // then we can actually get at it on with other resources - but maybe that 
  // leaks through the layers too much and the loadder class shouldn't really
  // know about the REST-based implementation?
  link
    .get('HEAD', 'collection', 'application/json')
    .done( function( content, status, settings ){
      
        ordersRepresentation = content

        $.when( _.map(content.orders, function( order ){
          return httpCall.get( order.href, order.type )
        }))
        .done( function( data ){
          _.each( data, function( entry ){
            entry
            .done( function( item, status, settings  ){
              $( function(){
                loader.add( item )
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