define( 
	['underscore'], 
	function(_){
	
	jasmine.addToEnv = function(env){
   _.each(env, function( func, key ){
     jasmine.Env.prototype[key] = func
     window[key] = function(desc, func){
       return jasmine.getEnv()[key](desc, func);
       if (isCommonJS) exports[key] = window[key];
     } 
   })			
	}
	
	jasmine.addToSpec = function(spec){
   _.each(spec, function( func, key ){
     jasmine.Spec.prototype[key] = func
     window[key] = function(){
       return jasmine.getEnv().currentSpec[key](arguments);
       if (isCommonJS) exports[key] = window[key];
     } 
   })			
	}
	
})