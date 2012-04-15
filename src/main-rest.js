require.config({
    baseUrl: "scripts/",
    paths: {
      requirejs: 'lib/requirejs/require-1.0.7',
      order:     'lib/requirejs/order-1.0.5',
      text:      'lib/requirejs/text-1.0.7',
      
      jsrender:     'lib/jsviews/jsrender-1.0pre',
      jsobservable: 'lib/jsviews/jsobservable-1.0pre',
      jsviews:      'lib/jsviews/jsviews-1.0pre',
  
      jquery:     'lib/jquery/jquery-1.7.1',
      underscore: 'lib/utils/underscore-1.2.3',
      date:       'lib/utils/easydate-0.2.4',
      
      /* this requires building first because it get html and we need 
       * to avoid a webserver/XmlHttp error.
      */
      'bootstrap-html': '../../build/scripts/bootstrap-html'
    },
    catchError: {
        define: true
    },

    priority: ["jquery", "bootstrap", "bootstrap-html", "rest-coffee/main"]
});