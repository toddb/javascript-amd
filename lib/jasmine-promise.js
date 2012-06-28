define(
   ['utils/log', 'jquery', 'underscore' /* 'jasmine', 'require-jasmine', 'mockjax' */, 'utils/deferredBefore'], 
   function( log, $, _, deferred ){
  
     log.loader('jasmine-promise')
     
     var mime = {
       Json: 'application/json'
     }
     var response = {
       OK: 200
     }
     
     // extensions to jasmine.Env
     var env = {
       load: function(context, func) {
          var spec = new jasmine.Spec(this, this.currentSuite, "should load " + context);
          this.currentSuite.add(spec);
          this.currentSpec = spec;

          // always load up the deferred with the expectation spies on a load
          this.beforeEach(function(){
            this.logger = jasmine.createSpy('deferred-spy-for-testing');
            this.expectations = []
            $.mockjaxClear();
            $.DEFAULT_DEFERRED = deferred(context, this.logger); 
            _.each(_.extend(mime,response), function(val, key){ window[key] = val})  
          })

          this.afterEach(function(){
            $.DEFAULT_DEFERRED = null
            $.mockjaxClear();
            _.each(_.extend(mime,response), function(val, key){ window[key] = null})  
          })

          if (func) {
            spec.runs(func);
          }

          spec.runs(function(){
             // load up the widget undertest and run expectations
             _requires( context, function(widget){ 
            
              waitsFor(function(){
                return spec.logger.callCount >= spec.expectations.length
              }, 'all ' + spec.expectations.length + ' expectation(s) to be executed but only ' + spec.logger.callCount + ' completed')

              runs(function(){
                _(spec.expectations.length).times(function(){
                  spec.expectations.shift()( context )
                })
                // and then cleanup the loaded widget    
                $(widget).remove()              
              })

             })()
          });

          return spec;
        }
     }
     
     // extensions to jasmine.Spec
     var spec = {
       gets: function (args) {
          // TODO: cleanup argument processing when needed
          var url = args[0]
            accept = args[1],
            status = args[2][0],
            responseText = args[2][1]

          $.mockjax( {
            url: url,
            type: 'GET',
            status: status || OK,
            headers: { Accept: accept || Json},
            responseText: responseText
          })

          var that = this
          this.expectations.push( function( context ){
            expect(that.logger).toHaveBeenCalledWith( [context, "GET", url, status] );
          })

          // var block = new jasmine.Block(this.env, func, this);
          // this.addToQueue(block);
          return this;
       },
       showing: function (args) {
         var args = _.toArray(args)
         var that = this
         this.expectations.push( function( context ){
           expect(that.logger).toHaveBeenCalledWith( _.flatten([context, args]));
         })
       },
       returning: function (args) {
         return _(args).map(function( val ){
          var ret
          if( _.isString(val) && val.match(/json!|html!|text!/)){
            _requires( val, function( r ){ 
                ret = r;
            })()
          } else {
            ret = val
          }
          return ret
         })
       }
     }

     // setup the jasmine.Spec methods in global namespace
     _.each(spec, function( func, key ){
       jasmine.Spec.prototype[key] = func
       window[key] = function(){
         return jasmine.getEnv().currentSpec[key](arguments);
         if (isCommonJS) exports[key] = window[key];
       } 
     })

     // setup the jasmine.Env methods in global namespace
     _.each(env, function( func, key ){
       jasmine.Env.prototype[key] = func
       window[key] = function(desc, func){
         return jasmine.getEnv()[key](desc, func);
         if (isCommonJS) exports[key] = window[key];
       } 
     })
  
})