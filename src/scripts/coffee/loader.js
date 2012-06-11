define('coffee/loader', ['utils/log', 'jquery', 'jsrender', 'jsobservable', 'jsviews', 'date'], function( log, $ ){
  
  log.loader('coffee/loader')
  
  // TODO: store shouldn't be a singleton - need one per instance
  var store = [],
    // these defaults should really be exposed publically so that I can query and reuse them in tests
    // Actually, I would expose them similarly to jQuery widgets through the one call
    // in fact, I should expose and allow events
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
        // initialise with a default empty list
        items: []
      },
      newOrder: {
        id: '#new-coffee',
        tmpl: '',
        types: [{type:'small'}]
      },
      add: {
        id: '#coffee .order',
        click: function(){}
      }
    },
    settings = $.extend(true, {}, defaults)
  
  function init( opts ){
         
    settings = $.extend(true, {}, defaults, opts);
    
    //store should really be empty and then come back re-render the GET
    store = settings.orders.items
    
    if (settings.appendTo != ''){
      // TODO: strip # off #coffee
      $('<div id="coffee">').appendTo(settings.appendTo)
    }
    // Note: 'this' uses these on the public interface and works with tests
    this.loadTemplates( settings.instructions.tmpl, settings.orders.tmpl, settings.newOrder.tmpl );
    this.renderParent( settings.instructions.id, {} );
    this.renderChild( settings.orders.id, store ); 
    this.renderNewChild( settings.newOrder.id, settings.newOrder.types );
    
    // TODO: there is no reason that orderHandler takes a queue/type of handlers for the promise
    this.orderHandler( settings.newOrder.id, settings.add.click  )
    
    hideNew()
    $(settings.add.id).click( function(){
      showNew()
    })
    
    // TODO: refactor
    formatDates( $(settings.orders.dates) )
    
    log.debug("Loader coffee page - rendered")
  }

  function loadTemplates( template1, template2, template3 ){
    // load up the cached templates ready for use as $.template.parent, $.template.child, etc
    $.templates({
        parent: template1,
        child: template2,
        newChild: template3
    });       
  }
  
// each of these render methods wrap the renderer for testing/design purposes
  
  function renderParent( el, data ){
    $(el).append( $.templates.parent.render( data ) )       
  }
  function renderChild( el, data ){
    // BUG: this errors at times from load order -- errors first on jsviews-1.0pre.js:23
    $.link.child( el, data );       
  }  
  function renderNewChild( el, data ){
    $(el).append( $.templates.newChild.render( data ) )       
  }
  function showNew(){
    $(settings.newOrder.id).show()
  }
  function hideNew(){
    $(settings.newOrder.id).hide()
  }
  
  function orderHandler( el, promise ){
    var that = this
    $('>form', el).submit( function(){
      
       // TODO:  implement me
       // transform the form object to json ready for submission     
       var order = {} 
    
        $.when( promise(order) )
         .done( function( order, statusText, jqXhrOk ){
           // a successful order will be added to the observable store
           that.add( order )
           // this success should be refactored out because it is merely
           // a workaround to the problem of jQuery easydate - and makes the code confusing
           // if anything it goes into the promise
           formatDates( $( settings.orders.dates ) )
           hideNew()
         })
         .fail( function( jqXhr, status, message ){
           // TODO: probably want to have some default implementation on re-submission
         })
             
        // block the POST on the native form submission
        return false
    })
  }
  
  function add( val ){
    $.observable( store ).insert( store.length, val);
  }
  
  function formatDates( el ){
    // note: easydate doesn't use jQuery live and thus all need to refreshed each time
    log.debug('ensure all dates are formatted')
    el.easydate();
  }
  

  return {
    add: add,
    orderHandler: orderHandler,
    init: init,
    loadTemplates: loadTemplates,
    renderParent: renderParent,
    renderChild: renderChild,
    renderNewChild: renderNewChild
  }
})
