/*
 * A boot script to load the basic requirejs and jquery. This file is 
 * combined by the RequireJS 'r.js' script, and the resulting file is
 * put into the project as 'bootstrap.js'.
 *
 * see http://requirejs.org
 */

//
// This list of modules is included in the initial load of files from the server.
// The requirejs r.js script will put these into a single file that is loaded
// explicitly by the HTML page using a SCRIPT element.
//
// The requirejs configuration does not require a configuration for these files
// as they are bundled together. More importantly, the individual files are not
// shipped/published to the web site thus the uglyified files must be used.
//
require(
    [
        'copyright',
        'utils/log',
        'requirejs',
        'order',
        'order!jquery',
        'order!jsrender',
        'order!jsobservable',
        'order!jsviews',
        'order!ui-core',
        'order!ui-widget',
        'order!ui-effects-core',
        'order!ui-effects-highlight',
        'text',
        'date',
        'bootstrap-html'

    ],
    function(copyright, log) {
        log.loader('bootstrap');
    });