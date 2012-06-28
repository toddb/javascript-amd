require({
    baseUrl: '../src/scripts',
    paths: {
      requirejs: 'lib/requirejs/require-1.0.7',
      order:     'lib/requirejs/order-1.0.5',
      text:      'lib/requirejs/text-1.0.7',
      json:      'lib/requirejs/json-0.0.1',
      
      jsrender:     'lib/jsviews/jsrender-1.0pre',
      jsobservable: 'lib/jsviews/jsobservable-1.0pre',
      jsviews:      'lib/jsviews/jsviews-1.0pre',

      jquery:      'lib/jquery/jquery-1.7.1',
      'ui-core':   'lib/jquery-ui/jquery.ui.core',
      'ui-widget': 'lib/jquery-ui/jquery.ui.widget',
      underscore:  'lib/utils/underscore-1.2.3',
      date:        'lib/utils/easydate-0.2.4',
      // when:        'lib/utils/when',
      // deferred:    'lib/utils/deferred',
      
      "jasmine": '../../lib/jasmine/jasmine',
      "jasmine-html": '../../lib/jasmine/jasmine-html',
      "require-jasmine": '../../lib/require-jasmine',
      "require-onerror": '../../lib/require-onerror',
      "jasmine-rest": '../../lib/jasmine-rest',
      "mockjax": '../../lib/mockjax',
      "bootstrap-html": '../../build/scripts/bootstrap-html',
      "server-data": '../../build/scripts/server/main',
      
      "tests": '../../test/tests'
      },
      priority: ["jquery", "bootstrap"]
    },
    ['jquery', 'require-onerror', 'utils/log', 'json', 'order!jasmine', 'order!jasmine-html', 'order!require-jasmine', 'order!mockjax', 'order!jasmine-rest', 'server-data', 'order!tests'], 
    function( $, onerror, log ){
  
      $(function(){

              $.mockjaxSettings = {
                log:           log.debug,
                status:        200,
                responseTime:  20,
                isTimeout:     false,
                contentType:   'text/plain',
                response:      '', 
                responseText:  '',
                responseXML:   '',
                proxy:         '',
                lastModified:  null,
                etag:          '',
                useAjax:       false, 
              };
              
              // add a div element to attach tests
              $('<div>', { id:'test', class:'test'}).appendTo('body')
              onerror.init();
              
              with (jasmine.getEnv()){
                // jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
                addReporter( new jasmine.HtmlReporter());
                updateInterval = 100;
                defaultTimeoutInterval = 1000;
                execute();
              }
      })

    }
  
)


