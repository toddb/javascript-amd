define('utils/css', ['utils/log', 'jquery'], function( log, $ ){
  
  log.loader('utils/css')
  
  var loadCss = function loadCss(url) {
        var link = $("<link>");
        link.attr({
          type: "text/css",
          rel: "stylesheet",
          href: url + ".css"
        }).appendTo("head");
        // $("head").append(link);
    }
    
  return loadCss

})