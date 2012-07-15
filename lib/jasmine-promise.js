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
            this.runsPreAfter = []
            this.isLoaded = false
            
            $.mockjaxClear();
            $.DEFAULT_DEFERRED = deferred(context, this.logger); 
            _.each(_.extend(mime,response), function(val, key){ window[key] = val})

						// see https://github.com/jeffwatkins/jasmine-dom/blob/master/lib/jasmine-dom-matchers.js
						// see http://tobyho.com/2012/01/30/write-a-jasmine-matcher/
						this.addMatchers({
							toHaveBeenLogged: function(expected){
								this.message = function(){
									return "I'm not giving you a good message!"
								}
								return this.actual < expected
							}
						})
						
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
            // widget may or may not have have init 
            // TODO: be able to pass params into the init function
             _requires( context, function(widget){ 
    
              if (_.isFunction(widget.init)) {
                  $.when( widget.init() )
                    .done(function( ){
                        spec.widget = this
                        spec.isLoaded = true;
                  })
                
                  waitsFor(function () {
                      return this.isLoaded
                  }, 'widget to initialise')
              } else {
                  spec.isLoaded = true
                  spec.widget = widget              
              }
            
            // FIXME: this wait needs to be tied into expectations
            waits(20)
  
              runs(function(){
               _(this.runsPreAfter.length).times(function(){
                  spec.runsPreAfter.shift().call(spec)
                })               
            
								console.log(this.expectations.length)
		            waits(200)

		            runs(function(){
		                _(this.expectations.length).times(function(){
			console.log(spec.expectations.length)
		                    spec.expectations.shift()( context )
		                })
		                // TODO: work out whether this could be added to afterEach dynamically when
		                // widget is loaded/initialised
		                this.widget.remove()    
		            })
          
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
          return this;
       },
       posts: function (args) {
         
          // TODO: cleanup argument processing when needed
          var url = args[0]
            accept = args[1],
            status = args[2][0],
            loc = args[2][1].Location

          $.mockjax( {
            url: url,
            type: 'POST',
            responseText: '',
            status: status || OK,
            headers: { Location: loc},
            async: false
          })           

          var that = this
          this.expectations.push( function( context ){
            expect(that.logger).toHaveBeenCalledWith( [context, "POST", url, status] );
          })
          // return this;
       },
       showing: function (args) {
         var args = _.toArray(args)
         var that = this
         this.expectations.push( function( context ){
           expect(that.logger).toHaveBeenCalledWith( _.flatten([context, args]));
         })
       },
       using: function ( func ) {
         this.runsPreAfter.push( func[0] )
         return this
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
       },
       wasClicked: function(args){
					var el = args[0],
						that = this;
					
         $(el).live('click', function(){
            $.Deferred().resolve([ el, 'was', 'clicked'])
         })

         this.expectations.push( function( context ){
           expect(that.logger).toHaveBeenCalledWith( [context, el, 'was', 'clicked']);
         })
       },
			 became: function(args){
					var originalShowMethod = jQuery.fn.show,
						that = this,
						el = args[0],
						style = args[1];
						
				    jQuery.fn.show = function(){
				        var result = originalShowMethod.apply( this, arguments );
								$.Deferred().resolve( [el, 'became', $(el).is(':hidden') ? ':hidden' : ':visible'] )
				        return result;
				    };
			
					that.expectations.push( function( context ){
					  expect(that.logger).toHaveBeenCalledWith( [context, el, 'became', style ]);
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