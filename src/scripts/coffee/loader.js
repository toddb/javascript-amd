define('coffee/loader', ['utils/log', 'jquery', 'coffee/link', 'jsrender', 'jsobservable', 'jsviews'], function( log, $, link ){
  
  log.loader('coffee/loader')
  
  var store = [];
  
  function init( parentId, parent_template, childId, child_template, data, el, handler, renderer){
    
    /*
    * Note: renderer is optionally passed in and allows for spies - hhhmmmmm
    */    
    var $this = renderer || this
    
    store = data
    $this.loadTemplates( parent_template, child_template );
    $this.renderParent( parentId, {} );
    $this.renderChild( childId, store ); 
    $this.orderHandler( el, handler )
    
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
  
  function orderHandler( el, cb ){
    var $this = this
    $(el).click( function(){
      return $this.order.apply( $this, [cb()] )
    })
  }
  
  function order( val ){
    // either inject the store or use the default implementation - this is useful for testing
    link = arguments[1] || link
    link.set( val, function( val ){
          $.observable( store ).insert( store.length, val);
    } ) 
  }
    
  return {
    order: order,
    orderHandler: orderHandler,
    init: init,
    loadTemplates: loadTemplates,
    renderParent: renderParent,
    renderChild: renderChild 
  }
})
