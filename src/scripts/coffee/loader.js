define('coffee/loader', ['utils/log', 'jquery', 'coffee/link', 'jsrender', 'jsobservable', 'jsviews', 'date'], function( log, $, link ){
  
  log.loader('coffee/loader')
  
  // TODO: store shouldn't be a singleton - need one per instance
  var store = [],
    settings,
    defaults = {
      appendTo: 'body',
      instructions: {
        id: '#coffee',
        tmpl: ''
      },
      orders: {
        id: '#coffee-orders',
        tmpl: '',
        dates: '.date',
        items: []
      },
      add: {
        id: '#coffee .order',
        click: function(){}
      }
    }
  
  function init( opts ){
         
    settings = $.extend(true, {}, defaults, opts);
    store = settings.orders.items
    
    if (settings.appendTo != ''){
      // TODO: strip # off #coffee
      $('<div id="coffee">').appendTo(settings.appendTo)
    }
    
    this.loadTemplates( settings.instructions.tmpl, settings.orders.tmpl );
    this.renderParent( settings.instructions.id, {} );
    this.renderChild( settings.orders.id, store ); 
    this.orderHandler( settings.add.id, settings.add.click, function(){ formatDates( $( settings.orders.dates ) ) }  )
    
    formatDates( $(settings.orders.dates) )
    
    log.debug("Main page - rendered")
  }

  function loadTemplates( template1, template2 ){
    $.templates({
        parent: template1,
        child: template2
    });       
  }
  
  function renderParent( el, data ){
    $(el).append( $.templates.parent.render( data ) )       
  }
  function renderChild( el, data ){
    $.link.child( el, data );       
  }  
  
  function orderHandler( el, cb, success ){
    var that = this
    $(el).click( function(){
       that.order.call( link, cb() )
       success()
    })
  }
  
  function order( val ){
    // context is link data store
    this.set( val, function( val ){
          $.observable( store ).insert( store.length, val);
    } ) 
  }
  

  function add( val ){  // duh, badness - duplicate with order
    $.observable( store ).insert( store.length, val);
  }
  
  function formatDates( el ){
    // note: easydate doesn't use jQuery live and thus all need to refreshed each time
    log.debug('ensure all dates are formatted')
    el.easydate();
  }
    
  return {
    add: add,
    order: order,
    orderHandler: orderHandler,
    init: init,
    loadTemplates: loadTemplates,
    renderParent: renderParent,
    renderChild: renderChild 
  }
})
