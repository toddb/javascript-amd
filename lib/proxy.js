define(
	['utils/log', 'underscore'],
	function( log, _ ){
	
	log.loader("proxy")
	
	var proxy = function(obj, methodName, guid){
		this.baseObj = obj
		this.methodName = methodName
		this.guid = guid
		this.originalFunc = obj[methodName]
		this.removeProxy = function(){
			this.baseObj[this.methodName] = this.originalFunc	
		}
	}
	
	var methods = {
		
		guid: 1,

		init: function(){
			this.overrides = []
			return this
		},
					
		override: function(obj, methodName, func){
			func.guid = this.guid = this.guid + 1;
			this.overrides.push(new proxy(obj, methodName, this.guid))
			obj[methodName] = func
		},
			
		resetAll: function(){
			_(this.overrides).each(function(proxy){
				proxy.removeProxy()
			})
			this.init()
		},
		
		reset: function(guid){
			this.overrides = _.reject(this.overrides, function(proxy){ 
				if (proxy.guid == guid){
					proxy.removeProxy()
					return true
				} else {
					return false
				}
			})
		}

	}
	
	return methods.init();
})