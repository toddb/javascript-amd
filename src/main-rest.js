require.config({
    baseUrl: "scripts/",
    paths: {
      requirejs: 'lib/requirejs/require-1.0.7',
      order:     'lib/requirejs/order-1.0.5',
      text:      'lib/requirejs/text-1.0.7',
      json:    'lib/requirejs/json-0.0.1',
      
      jsrender:     'lib/jsviews/jsrender-1.0pre',
      jsobservable: 'lib/jsviews/jsobservable-1.0pre',
      jsviews:      'lib/jsviews/jsviews-1.0pre',
  
      jquery:      'lib/jquery/jquery-1.7.1',
      'ui-core':   'lib/jquery-ui/jquery.ui.core',
      'ui-widget': 'lib/jquery-ui/jquery.ui.widget',
      'ui-effects-core': 'lib/jquery-ui/jquery.effects.core',
      'ui-effects-highlight': 'lib/jquery-ui/jquery.effects.highlight',
      underscore:  'lib/utils/underscore-1.2.3',
      date:        'lib/utils/easydate-0.2.4',
      
      /* this requires building first because it get html and we need 
       * to avoid a webserver/XmlHttp error.
      */
      'bootstrap-html': '../../build/scripts/bootstrap-html'
    },
    catchError: {
        define: true
    },

    priority: ["jquery", "bootstrap", "bootstrap-html", "loader"]
});