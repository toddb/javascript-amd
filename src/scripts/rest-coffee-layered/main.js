define(
  ['utils/log', 'jquery', 'underscore', 'utils/semanticLink', 'utils/httpCall', 'date', 'coffee/ui' ], 
  function( log, $, _, link, httpCall){
  
  log.loader("rest-coffee-layered/main")
  
  var orders, ordersRepresentation;
    
  $( function(){
     
     orders = $('<div>').appendTo('body')
     orders.teller({
       render: {
         instructions: require('text!coffee/views/index.html'),
         newOrder: {
           txt: require('text!coffee/views/_new.html'),
           into: "#new-coffee"
         }
       },
       link: {
         orders: {
           txt: require('text!coffee/views/_item.html'),
           into: "#coffee-orders"
         }
       },
       create: function(){
         $('#new-coffee').hide()         
         getOrders()
       },
       added:  function(event, val){
          $('.date').easydate();
       },
       buttons: {
         'Order New Coffee': function( event, ui ){
           $('#new-coffee').show()
           $('button.order').hide()
         },
         Submit: function( event, ui ){
           
           // collect the values from the inputs
           var order = {}
           _.each($(event.toElement).siblings(), function(input){
             order[input.name] = input.value
           })

           $.when( createOrder(order) )
            .done( function( item, statusText, jqXhrOk ){
              // a successful order will be added to the observable store
              orders.teller('addOrder', item )
              $('button.order').show()
            })
            .progress(function(){
              $('#new-coffee').hide()
            })
            .fail( function( jqXhr, status, message ){
               $('#new-coffee').show()
               // TODO: probably want to have some default implementation on re-submission
            })          
         }
       }
     })
    
      function createOrder( order ){
         var result = new $.Deferred();
         result.notify("Begin");
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

      function getOrders(){
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
                      orders.teller('addOrder', item )
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
      }
  
  })
  
  return orders
  
});

 