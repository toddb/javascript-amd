/*
* see https://github.com/jrburke/r.js/blob/master/build/example.build.js
*/
({
    appDir: "src",
    baseUrl: "scripts/",
    dir: "build",
    
    //See https://github.com/mishoo/UglifyJS for the possible values.
    // Comment out the optimize line if you want
    // the code minified by UglifyJS
    optimize: "none",
    // optimize: "uglify",
    uglify: {
            beautify: true,
            index : 0,
            max_line_len : 120
    },

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
      
    },
    
    optimizeAllPluginResources: false,
    
    modules: [        
        {
             // The bootstrap module is common javascript and resources for all pages.
             //  It should include:
             //    - jQuery
             //    - RequireJS  (AMD)
             //    - RequireJS plugins
             //    - basic logging
             //    - the copyright module, so that the minified code has a copyright.
             name: "bootstrap"
        },
        {
          name: "coffee/main",
          exclude: [ 'jquery', 'utils/log', 'text', 'jsrender', 'jsobservable', 'date', 'jsviews', 'ui-core', 'ui-widget', 'text!coffee/views/_item.html', 'text!coffee/views/index.html', 'text!coffee/views/_new.html']
        },
        {
          name: 'rest-coffee/main',
          exclude: [ 'jquery', 'utils/log', 'text', 'jsrender', 'jsobservable', 'jsviews', 'date', 'lib/ui', 'lib/widget', 'underscore', 'order']
        },
        {
          name: 'rest-coffee-promise/main',
          exclude: [ 'jquery', 'utils/log', 'text', 'jsrender', 'jsobservable', 'jsviews', 'date', 'lib/ui', 'lib/widget', 'underscore', 'order']
        },
        {
          name: 'bootstrap-html',
          exclude: [ 'text', 'utils/log' ]
        },
        {
          name: 'server/main',
          exclude: [ 'json' ]
        }
    ],
    
    //Allow CSS optimizations. Allowed values:
    //- "standard": @import inlining, comment removal and line returns.
    //Removing line returns may have problems in IE, depending on the type
    //of CSS.
    //- "standard.keepLines": like "standard" but keeps line returns.
    //- "none": skip CSS optimizations.
    optimizeCss: "standard",

})
