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

		var originalDeferred = jQuery.Deferred
		
		jQuery.Deferred = function( func ) {
			var doneList = jQuery.Callbacks( "once memory" ),
				failList = jQuery.Callbacks( "once memory" ),
				progressList = jQuery.Callbacks( "memory" ),
				state = "pending",
				lists = {
					resolve: doneList,
					reject: failList,
					notify: progressList
				},
				promise = {
					done: doneList.add,
					fail: failList.add,
					progress: progressList.add,

					state: function() {
						return state;
					},

					// Deprecated
					isResolved: doneList.fired,
					isRejected: failList.fired,

					then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
						deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
						return this;
					},
					always: function() {
						deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
						return this;
					},
					pipe: function( fnDone, fnFail, fnProgress ) {
						return jQuery.Deferred(function( newDefer ) {
							jQuery.each( {
								done: [ fnDone, "resolve" ],
								fail: [ fnFail, "reject" ],
								progress: [ fnProgress, "notify" ]
							}, function( handler, data ) {
								var fn = data[ 0 ],
									action = data[ 1 ],
									returned;
								if ( jQuery.isFunction( fn ) ) {
									deferred[ handler ](function() {
										returned = fn.apply( this, arguments );
										if ( returned && jQuery.isFunction( returned.promise ) ) {
											returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
										} else {
											newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
										}
									});
								} else {
									deferred[ handler ]( newDefer[ action ] );
								}
							});
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						if ( obj == null ) {
							obj = promise;
						} else {
							for ( var key in promise ) {
								obj[ key ] = promise[ key ];
							}
						}
						return obj;
					}
				},
				deferred = promise.promise({}),
				key;

			for ( key in lists ) {
				deferred[ key ] = lists[ key ].fire;
				deferred[ key + "With" ] = lists[ key ].fireWith;
			}

			// Handle state
			deferred.done( function() {
				state = "resolved";
			}, failList.disable, progressList.lock ).fail( function() {
				state = "rejected";
			}, doneList.disable, progressList.lock );

		   // patched for injection - tb, june 2012
		   if (jQuery.injectDeferred) {
		     jQuery.injectDeferred.call( deferred, deferred )
		   }

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		}

		// extensions to jasmine.Env
		var env = {
			xload: function(desc, func) {
				return {
					id: this.nextSpecId(),
					runs: function(){}
				}
			},
			load: function(context, func) {
				var spec = new jasmine.Spec(this, this.currentSuite, "should load " + context);
				this.currentSuite.add(spec);
				this.currentSpec = spec;

				this.beforeEach(function(){

					var removeSatisfiedExpectations = function(){
						spec.expectations = _.reject(spec.expectations, function( expect ){ return _.isEqual(expect(context), this)}, arguments[0])
					}

			  	this.logger = jasmine.createSpy('deferred-spy-for-testing').andCallFake( removeSatisfiedExpectations );
			  	this.expectations = []
			  	this.runsPreAfter = []
			  	this.isLoaded = false
					this.selector = null

					this.expectation = function(){
						var args = _.toArray(arguments)
						this.expectations.push( function(context){ return _.flatten([context, args])})
					}

			  $.mockjaxClear();
			  $.injectDeferred = deferred(context, this.logger); 
			  _.each(_.extend(mime,response), function(val, key){ window[key] = val})

			})

			this.afterEach(function(){
			  $.injectDeferred = null
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
				var el = args[0] || this.selector;
				this.selector = el

				  $(el).live('click', function(){
				     $.Deferred().resolve([ el, 'was', 'clicked'])
				  })

				this.expectation(el, 'was', 'clicked')
			},
			became: function(args){
				args = _.toArray(args)
				var style = args.pop(),
				el = args[0] || this.selector;

				// TODO: push these onto a stack and reset on after
				var	originalShowMethod = jQuery.fn.show;
				this.selector = el

				jQuery.fn.show = function(){
				  var result = originalShowMethod.apply( this, arguments );
					if ($(el).is(style)){ 
						$.Deferred().resolve( [el, 'became', $(el).is(':hidden') ? ':hidden' : ':visible'] )
					}
				  return result;
				};
				this.expectation(el, 'became', style)
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

		/* new jasmine waiting for the expectations to get correct msgs out */
		// this sequence allow for timeoutMessage to be a callback function
		var waitsForExpectation = function(latchFunction, optional_timeoutMessage, optional_timeout) {
		  jasmine.getEnv().currentSpec.waitsForExpectation.apply(jasmine.getEnv().currentSpec, arguments);
		};
		if (isCommonJS) exports.waitsFor = waitsFor;

		jasmine.WaitsForExpectationBlock = function(env, timeout, latchFunction, messageOrFunc, spec) {
		  this.timeout = timeout || env.defaultTimeoutInterval;
		  this.latchFunction = latchFunction;
		  this.message = messageOrFunc;
		  this.totalTimeSpentWaitingForLatch = 0;
		  jasmine.Block.call(this, env, null, spec);
		};
		jasmine.util.inherit(jasmine.WaitsForExpectationBlock, jasmine.Block);

		jasmine.WaitsForExpectationBlock.prototype.execute = function(onComplete) {
		  if (jasmine.VERBOSE) {
		    this.env.reporter.log('>> Jasmine waiting for ' + ((typeof this.message == 'function' ? this.message.apply(this.spec) : this.message) || 'something to happen'));
		  }
		  var latchFunctionResult;
		  try {
		    latchFunctionResult = this.latchFunction.apply(this.spec);
		  } catch (e) {
		    this.spec.fail(e);
		    onComplete();
		    return;
		  }

		  if (latchFunctionResult) {
		    onComplete();
		  } else if (this.totalTimeSpentWaitingForLatch >= this.timeout) {
		    var message = 'timed out after ' + this.timeout + ' msec waiting for ' + ((typeof this.message == 'function' ? this.message.apply(this.spec) : this.message) || 'something to happen');
		    this.spec.fail({
		      name: 'expectations timeout',
		      message: message
		    });

		    this.abort = true;
		    onComplete();
		  } else {
		    this.totalTimeSpentWaitingForLatch += jasmine.WaitsForBlock.TIMEOUT_INCREMENT;
		    var self = this;
		    this.env.setTimeout(function() {
		      self.execute(onComplete);
		    }, jasmine.WaitsForBlock.TIMEOUT_INCREMENT);
		  }
		};


		jasmine.Spec.prototype.waitsForExpectation = function(latchFunction, optional_timeoutMessageOrFunc, optional_timeout) {
		  var latchFunction_ = null;
		  var optional_timeoutMessage_ = null;
		  var optional_timeout_ = null;

		  for (var i = 0; i < arguments.length; i++) {
		    var arg = arguments[i];
		    switch (typeof arg) {
		      case 'function':
						if (i == 0) latchFunction_ = arg;
						if (i == 1) optional_timeoutMessage_ = arg;
		        break;
		      case 'string':
		        optional_timeoutMessage_ = arg;
		        break;
		      case 'number':
		        optional_timeout_ = arg;
		        break;
		    }
		  }

		  var waitsForFunc = new jasmine.WaitsForExpectationBlock(this.env, optional_timeout_, latchFunction_, optional_timeoutMessage_, this);
		  this.addToQueue(waitsForFunc);
		  return this;
		};

})