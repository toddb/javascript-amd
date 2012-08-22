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
			
			// load can take module, [description]
			// load( context )
			// load( [context, description] )
			//
			// For example:
			//  load('myrequire')
			//  load(['myrequire', 'comment to be added in test'])
			load: function(context, func) {
				var description
				if (_.isArray(context)){
					description = " " + context[1]
					context = context[0]
				}
				
				describe("should load " + context, function(){
										
					beforeEach(function() {
						var spec = this
						var removeSatisfiedExpectations = function(){
							var expectation = arguments[0]
							spec.expectations = _.reject(spec.expectations, function( expect ){ return _.isEqual(expect(context), this)}, expectation)
						}

						// each time a deferred spy is called it checks and removes any satisfied expectations
				  	this.logger = jasmine.createSpy('deferred-spy-for-testing').andCallFake( removeSatisfiedExpectations );
						// internal list of all hijacked functions/events that we attached a deferred object to (eg .show(), .hide())
						this.proxies = proxy
						// internal set of exptectations to checked for at any stage
				  	this.expectations = []
						// internal 'runs' list to executed prior to leaving 'it' method
				  	this.runsBeforeExpectations = []
						// internal widget/DOM information
				  	this.isLoaded = false
				    // widget DOM element
						this.selector = null
						// widget jQuery reference
						this.widget = null
						// widget function reference
						this.context = null

						this.expectation = function(){
							var args = _.toArray(arguments)
							this.expectations.push( function(context){ return _.flatten([context, args])})
						}

					  $.mockjaxClear();
						// swap out our new deferred implementation which has a new hook
					  this.proxies.override($, 'Deferred', deferredPromise)
					  // we now intercept on the hook
						// TODO?: with the override we now may simply just rewrite deferred and inject directly rather than a hook
					  $.injectDeferred = deferred(context, this.logger); 
					  // KLUDGE: mime and response into global namespace for ease
					  _.each(_.extend(mime,response), function(val, key){ window[key] = val})
					});
					
					afterEach(function() {
					  $.injectDeferred = null
					  this.proxies.reset($.Deferred.guid)
					  $.mockjaxClear();
					  _.each(_.extend(mime,response), function(val, key){ window[key] = null}) 
					  // Destroy is an assumption about how we create widgets - this may not hold for long
						if (_.isFunction(this.context.destroy)) this.context.destroy()
						// Remove is an assumption that we are using a jQuery type interface
						if (_.isFunction(this.widget.remove)) this.widget.remove()
					});
					
					it(description, function() {					
						var spec = this
					
						if (func) {
						  runs(func);
						}
						
						runs(function(){
						   // load up the widget undertest and run expectations
						   // widget may or may not have have init 
						   // TODO: be able to pass params into the init function
						   _requires( context, function(widget){ 

									if (_.isFunction(widget.init)) {
										$.when( widget.init() )
										 .done(function( ){	
										     spec.context = widget
										     spec.widget = this
										     spec.isLoaded = true;
										})
									} else {
										spec.isLoaded = true
										spec.widget = widget              
									}

									waitsFor(function () { return spec.isLoaded }, 'widget to initialise')

									runs(function(){
										_(this.runsBeforeExpectations.length).times(function(){
									  	spec.runsBeforeExpectations.shift().call(spec)
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
						
					});
					
				})

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
			  this.runsBeforeExpectations.push( func[0] )
			},
			// TODO: I really want this to be in the matcher form of expect().toBe() but with a waitsFor as the condition
			//  to do asynch event expectations
			// NOTE: expecting should be within 'using' otherwise executed too early
			//
			// For example, replace
			//  expecting("three orders to be rendered", function(){
			//	 return $('li').size() >= 3
			//  })
			//
			// With:
			//  expecting($('li').size()).toBeGreaterThan(3)
			expecting: function( args ){
				  var expect = _.isFunction(args[0]) ? args[0] : args[1]
					var msg = _.isString(args[0]) ? args[0] : ""
					waitsFor(expect, msg)
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