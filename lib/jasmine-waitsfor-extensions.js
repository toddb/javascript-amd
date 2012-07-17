define(
	['utils/log'], 
	function( log){
  
		log.loader('jasmine-waitsfor-extensions')


		/* new jasmine waiting for the expectations to get correct msgs out */
		// this sequence allow for timeoutMessage to be a callback function
		waitsForExpectation = function(latchFunction, optional_timeoutMessage, optional_timeout) {
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