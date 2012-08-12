define(
	['utils/log', 'jquery', 'underscore' /* 'jasmine', 'require-jasmine', 'mockjax' */, 'utils/deferredBefore', 'jasmine-promise-deferred', 'proxy', 'jasmine-core-extensions', 'jasmine-waitsfor-extensions'], 
	function( log, $, _, deferred, deferredPromise, proxy ){
  
		log.loader('jasmine-promise')

		var mime = {
		  Json: 'application/json'
		}
		var response = {
		  OK: 200
		}
	
		jasmine.addToEnv({
			xload: function(desc, func) {
				return {
					id: this.nextSpecId(),
					runs: _.noop
				}
			},
			load: function(context, func) {
				// allows context to either be string or array
				// load('myrequire')
				// load(['myrequire', 'comment to be added in test'])
				var description
				if (_.isArray(context)){
					description = " " + context[1]
					context = context[0]
				}
				var spec = new jasmine.Spec(this, this.currentSuite, "should load " + context + description);
				this.currentSuite.add(spec);
				this.currentSpec = spec;

				this.beforeEach(function(){

					var removeSatisfiedExpectations = function(){
						spec.expectations = _.reject(spec.expectations, function( expect ){ return _.isEqual(expect(context), this)}, arguments[0])
					}

			  	this.logger = jasmine.createSpy('deferred-spy-for-testing').andCallFake( removeSatisfiedExpectations );
					this.proxies = proxy
			  	this.expectations = []
			  	this.runsPreAfter = []
			  	this.isLoaded = false
					this.selector = null

					this.expectation = function(){
						var args = _.toArray(arguments)
						this.expectations.push( function(context){ return _.flatten([context, args])})
					}

			  $.mockjaxClear();
				// swap out our new deferred implementation which has a new hook
			  this.proxies.override($, 'Deferred', deferredPromise)
			  // we now intercept on the hook
				// note: with the override we now may simply just rewrite deferred and inject directly rather than a hook
			  $.injectDeferred = deferred(context, this.logger); 
			  _.each(_.extend(mime,response), function(val, key){ window[key] = val})

			})

			this.afterEach(function(){
			  $.injectDeferred = null
			  this.proxies.reset($.Deferred.guid)
			  $.mockjaxClear();
			  _.each(_.extend(mime,response), function(val, key){ window[key] = null})  
				this.widget && this.widget.remove && this.widget.remove()
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
					  waitsFor(function () { return this.isLoaded }, 'widget to initialise')
					} else {
					  spec.isLoaded = true
					  spec.widget = widget              
					}

					runs(function(){
						_(this.runsPreAfter.length).times(function(){
					  	spec.runsPreAfter.shift().call(spec)
						})
					})

					// loops through any remaining expectations
					// - removing any that were called on the spy
					// - it will timeout if expectations are left
					// - and then report on expectations not completed
					waitsForExpectation(function(){
						this.expectations = _.reject(this.expectations, function( expect ){
							return _.reduce(this, function(val, key){ 
								return _.isEqual(key[0], this) ? true : val
								}, false, expect(context))
							}, this.logger.argsForCall)
						return this.expectations.length == 0
						}, function(){
						return "expectations. " +  this.expectations.length  +" have not been fulfilled - " + 
						  // buildup the error message of non-fulfilled expectations
							_.reduce(this.expectations, function(msg, exp){ return msg + jasmine.pp(exp(context))}, "")
						})

			   })() // end of _requires widget
			});

			return spec;
			}
		})
     
		jasmine.addToSpec({
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

				this.expectation("GET", url, status)
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

				this.expectation("POST", url, status)
			},
			showing: function (args) {
				this.expectation(_.toArray(args))
			},
			using: function ( func ) {
			  this.runsPreAfter.push( func[0] )
			},
			returning: function (args) {
			  return _(args).map(function( val ){
						// retrieve text from file otherwise return string itself
			    	if( _.isString(val) && val.match(/json!|html!|text!/)){
				     _requires( val, function( r ){ val = r })()
				   	}
			    	return val
			  	})
			},
			// sets the selector DOM element for the test
			_$: function(args){
				var el = args[0] || this.selector;
				this.selector = el
				return this
			},
			was: function(args){
				var events = { clicked: 'click' },
					action = args[0],
					evt = _.find(events, function(evt, act){ return act == action }),
					el = _$(args[1]).selector
				
			  $(el).live(evt, function(){
			     $.Deferred().resolve([ el, 'was', action])
			  })

				this.expectation(el, 'was', action)
			},
			became: function(args){
				args = _.toArray(args)
				var style = args.pop(),
					el = _$(args[0]).selector;			
				
				this.proxies.callThrough(jQuery.fn, 'show', function(){
					if ($(el).is(style)){ 
						$.Deferred().resolve( [el, 'became', $(el).is(':hidden') ? ':hidden' : ':visible'] )
					}
				})
				this.expectation(el, 'became', style)
			}
		})

})