define( ['utils/log', 'jquery', 'underscore', 'utils/semanticLink', 'utils/httpCall', 'lib/ui', 'utils/deferred', 'date' ], 
  function( log, $, _, link, httpCall, ui, deferred){
  
  log.loader("rest-coffee-deferred/main")
    
  var el, ordersRepresentation;
    
  $( function(){
    
      var orders = []
      
      $.when( init(orders) )
        .done( function(){
          
              $(':button(:contains(Order New Coffee))').click(function(){
               $('#new-coffee').show()
               $('button.order').hide()       
              })  

              $(':submit[value=Submit]').click(function( event ){

                $('#new-coffee').hide()

                var order = {}
                _.each($(event.toElement).siblings(), function(input){
                  order[input.name] = input.value
                })

                $.when( createOrder(order) )
                 .done( function( item, statusText, jqXhrOk ){
                   ui.observable(orders).insert( orders.length, order );
                   $('button.order').show()
                   $('#new-coffee').hide()
                 })
                 .progress(function(){
                   $('#new-coffee').hide()
                 })
                 .fail( function( jqXhr, status, message ){
                    $('#new-coffee').show()
                 })       
              })
        })
       
      function init( orders ){  
        var instructions = 'text!coffee/views/index.html',
          orders = 'text!coffee/views/_item.html',
          newOrder = 'text!coffee/views/_new.html'
        
        ui.templates({
            instructions: require(instructions),
            orders: require(orders),
            newOrder: require(newOrder)
        });

        el = $('<div>')
          .append( ui.templates.instructions.render( {} ) )
          .appendTo('body')

        $('#new-coffee').append( ui.templates.newOrder.render( '#new-coffee', {} ))

        ui.link.orders( "#coffee-orders", orders );

        $('#new-coffee').hide() 
        $('.date').easydate();

        return $.Deferred().resolve([instructions, orders, newOrder])
      }
     
      function createOrder( order ){
         var result = $.Deferred();
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
                    ui.observable(orders).insert( orders.length, item );
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
  })
  
  return el
  
});    

