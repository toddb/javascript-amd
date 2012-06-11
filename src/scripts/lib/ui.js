define( ['order!jquery', 'order!jsrender', 'order!jsviews', 'order!jsobservable'], function( $ ){

  // Wrap jsrender
  return {
    templates: $.templates,
    observable: $.observable,
    link: $.link
  }
  
})
