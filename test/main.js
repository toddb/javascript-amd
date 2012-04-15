require({
    baseUrl: '../src/scripts',
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
      
      "jasmine": '../../lib/jasmine/jasmine',
      "jasmine-html": '../../lib/jasmine/jasmine-html',
      "require-jasmine": '../../lib/require-jasmine',
      "require-onerror": '../../lib/require-onerror',
      "mockjax": '../../lib/mockjax',
      "bootstrap-html": '../../build/scripts/bootstrap-html',
      
      "tests": '../../test/tests'
      },
      priority: ["jquery", "bootstrap"]
    },
    ['jquery', 'require-onerror', 'utils/log', 'order!jasmine', 'order!jasmine-html', 'order!require-jasmine', 'order!mockjax', 'order!tests'], 
    function( $, onerror, log ){
  
      $(function(){

              $.mockjaxSettings = {
                log:           log,
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
              };
              
              // add a div element to attach tests
              $('<div>', { id:'test', class:'test'}).appendTo('body')
              onerror.init();
              jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
          	  jasmine.getEnv().execute();       
      })

    }
  
)


