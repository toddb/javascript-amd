/**
* @license Copyright (c) 2012, toddb GoneOpen Limited.
* Available via the MIT or new BSD license.
* based on https://gist.github.com/966776 (mathieul) and forked to https://gist.github.com/1474205

* jasmine.requirejs() returns a function that will load the file(s) required
* and will wait until it's done before proceeding with running specs.
* The function returned is intended to be passed to beforeEach() so the file(s)
* is(are) loaded before running each spec.
*
* Syntax:
*
* jasmine.requirejs([options,] files, [callback])
* alias: _requires([options,] files, [callback])
*
* Where:
* - options is a configuration object like the one you
* can bass to RequireJS require() function (i.e.: baseUrl, paths, etc...)
* and
* - files is an array of files to require (i.e.: ['lib/common', 'views/main'])
* - files can be a string of a file to require (i.e.: 'lib/common')
* - callback is the named parameters as you get from requirejs (ie function(common, main){})
*
* Examples:
* 
* Loading either using jasmine.requirejs or via alias _requires
*
* beforeEach(jasmine.requirejs({
*     baseUrl: '/public/javascripts'
*   }, 
*   ['lib/app.help-mgr']
*  ));
*
* or
*
* beforeEach(_requires('lib/app.help-mgr'));  // no array is okay for single item
* beforeEach(_requires(['lib/app.help-mgr']));
* beforeEach(_requires(['lib/app.help-mgr', 'lib/other']));
*
*
* Loading using alias _requires and getting access to the return functions
*
*  (using the arguments passed through)
* beforeEach(_requires(['underscore'], function(){ _ = arguments[0]}));
*
*   or 
*
*  (using explicit arguments and then scoping more widely for the tests)
* beforeEach(_requires(['underscore'], function( u ){ _ = u }));
*
*
* Additional Option 1: you can set the require config for multiple requires
*
* jasmine.requirejs.config = {
*    BaseUrl: '/public/javascripts'
*   } 
*
*/
_requires = jasmine.requirejs = function () {
  
   // TODO: be able to hand in just a string for the require
    var params = Array.prototype.slice.call(arguments),
        isLoaded = false,
        files;
    
    // if the last argument is a callback then grab it for calling later
    var cb = function(){}
    if(typeof params[params.length - 1] == 'function') {
      cb = params.pop()
    }
 
    /* load up a global setting for the require config */       
    if (params.length == 1) params.unshift({})
    params[0] = $.extend(true, {}, jasmine.requirejs.config, params[0])
    // allows for us to hand in a single string require instead of array
    // eg _requires('module') is same as _requires(['module'])
    // I found that I often forgot the syntax of array style
    params[1] = typeof params[1] === 'string' ? [params[1]] : params[1]
    
    files = arguments[0].length ? arguments[0] : arguments[1];
    if (typeof files === 'string') files = [files]
    files = files.join(', ');
    return function () {
        require.apply(null, params.concat(function () {
            cb.apply(null, arguments)
            isLoaded = true;
        }));
        waitsFor(function () {
            return isLoaded;
        }, 'file(s) to be required/loaded: ' + files);
    };
};

jasmine.requirejs.config = {} 
