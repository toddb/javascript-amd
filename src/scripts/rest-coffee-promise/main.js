define( ['utils/log', 'jquery', 'underscore', 'utils/semanticLink', 'utils/httpCall', 'lib/ui', 'date' ],
    function( log, $, _, link, httpCall, ui){

        var options = {
                parent: 'body'
            },
            orders = [];

        function init( settings ){

            var result = $.Deferred(),
                settings = _.extend( {}, options, settings),
                ordersRepresentation;

            result.notify("loading rest-coffee-promise/main")

            $.when( create(orders, settings) )
                .done( function(){

                    var widget = this;

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
                                            result.rejectWith( widget, ["Items error occured", status, message] )
                                        })
                                })
                            })
                            .done( function(){

                                $(':button(:contains(Order New Coffee))').click(function(){
                                    $('#new-coffee', widget).show()
                                    $('button.order', widget).hide()
                                })

                                $(':submit[value=Submit]').click(function( event ){

                                    $('#new-coffee', widget).hide()

                                    // TODO: write a nicer form parser when necessary
                                    var order = {}
                                    _.each($(event.target).siblings(), function(input){
                                        order[input.name] = input.value
                                    })

                                    $.when( createOrder(order, ordersRepresentation) )
                                    .done( function( item, statusText, jqXhrOk ){
                                        ui.observable(orders).insert( orders.length, item );
                                        $('button.order', widget).show()
                                        $('#new-coffee', widget).hide()
                                    })
                                    .progress(function(){
                                        $('#new-coffee', widget).hide()
                                    })
                                    .fail( function( jqXhr, status, message ){
                                         $('#new-coffee', widget).show()
                                    })
                                })
                                result.resolveWith( widget, ["Resource loaded and handlers added"] )
                            })

                        })
                        .fail( function( jqXhr, status, message ){
                            result.rejectWith( widget, ["HEAD collection error occurred", status, message] )
                        })


                })

            return result.promise()

        }

        function create( orders, settings ){
            var result = $.Deferred(),
                instructions = 'text!coffee/views/index.html',
                order = 'text!coffee/views/_item.html',
                newOrder = 'text!coffee/views/_new.html'

            ui.templates({
                instructions: require(instructions),
                orders: require(order),
                newOrder: require(newOrder)
            });

            var widget = $('<div>')
                .append( ui.templates.instructions.render( {} ) )
                .appendTo( settings.parent)

            $('#new-coffee').append( ui.templates.newOrder.render( '#new-coffee', {} ))

            ui.link.orders( "#coffee-orders", orders );

            $('#new-coffee', widget).hide()
            $('.date', widget).easydate();

            result.notify([instructions, order, newOrder]);

            return result.resolveWith( widget )
        }

        function createOrder( order, ordersRepresentation ){
            var result = $.Deferred();
            result.notify("Creating order");
            link
                .post(ordersRepresentation, 'collection', '*', order, 'json')
                .done(function (content, status, settings) {
                    var orderUrl = settings.getResponseHeader('Location');
                    result.notify('Order created at ' + orderUrl)
                    httpCall
                        .get(orderUrl, 'application/json')
                        .done(function (order, statusText, jqXhrOk) {
                            result.notify('Query new order suceeded')
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


        return {
            init: init
        }

    });

