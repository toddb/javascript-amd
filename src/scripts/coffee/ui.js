define('coffee/ui', ['utils/log', 'jquery', 'underscore', 'widget', 'jsrender', 'jsobservable', 'jsviews', 'date'], function( log, $, _, widget ){
  
  log.loader('coffee/ui')
  
// Writing a widget posts:
//- http://forum.jquery.com/topic/how-to-write-my-own-widget
//- http://blog.nemikor.com/2010/05/15/building-stateful-jquery-plugins/
//- https://github.com/shichuan/javascript-patterns/blob/master/jquery-plugin-patterns/ui-widget-requirejs-module.html

    var DEFAULTS = {
      buttons: 
        [ {
          text: 'Order New Coffee',
          click: function() {}
        },
        {
          text: 'Add',
          id: '#coffee .order',
          click: function() {}
        }],
      link: 
        {
          orders: {
            tmpl: '',
            data: [],
            id: '#coffee-orders'
          }
        },
      render: 
        {
          instructions: {
            tmpl: '',
            data: '',
            id: '#coffee'
          }, 
          newOrder: {
            tmpl: '',
            data: [{type:'small'}],
            id: '#new-coffee'
          }
        }
    }

    // define your widget under the coffee namespace
    widget( "coffee.teller", { 

        // Options to be used as defaults
        options: {}, 

        // Set up widget (e.g. create element, apply theming,
        // bind events, etc.)
        _create: function () {

            // _create will automatically run the first time
            // this widget is called. Put the initial widget
            // set-up code here, then you can access the element
            // on which the widget was called via this.element.
            // The options defined above can be accessed via
            // this.options
            this._loadTemplates( _.extend({}, this.options.render, this.options.link) );
            this._renderTemplates( this.options.render );
            this._linkTemplates( this.options.link );
		        this._createButtons( this.options.buttons );
		        
        },

        // Destroy an instantiated plugin and clean up modifications
        // that the widget has made to the DOM
        _destroy: function () {
            $(this.element[0]).empty()
        },

        // methodB: function ( event ) {
        //     // _trigger dispatches callbacks the plugin user can
        //     // subscribe to
        //     //signature: _trigger( "callbackName" , [eventObject],
        //     // [uiObject] )
        //     this._trigger('methodA', event, {
        //         key: value
        //     });
        // },
        // 
        // methodA: function ( event ) {
        //     this._trigger('dataChanged', event, {
        //         key: value
        //     });
        // },

        // Respond to any changes the user makes to the option method
        _setOption: function ( key, value ) {
            switch (key) {
              case "link":
 
                  //this.options.someValue = doSomethingWith( value );
                 // break;
              case "render":
  
               
                  //this.options.someValue = doSomethingWith( value );
                 // break;
            default:
                //this.options[ key ] = value;
                break;
            }

            this._super( "_setOption", key, value );
        },

        //somewhere assetHtml would be used for templating, depending
        // on your choice.
        
        _createButtons: function( buttons ) {
      		var that = this,
      			hasButtons = false;

      		if ( typeof buttons === "object" && buttons !== null ) {
      			$.each( buttons, function() {
      				return !(hasButtons = true);
      			});
      		}
      		
      		// loop through the buttons adding handlers and styling
      		if ( hasButtons ) {
      		  
      			$.each( buttons, function( name, props ) {
      				props = $.isFunction( props ) ?
      					{ click: props, text: name } :
      					props;
      				$( "<button type='button'>" ).find(':contains(' + name + ')')
      					.attr( props, true )
      					.unbind( "click" )
      					.click(function() {
      						props.click.apply( that.element[0], arguments );
      					})
      				if ( $.fn.button ) {
      					button.button();
      				}
      			});
      		} 
      	},
      	
      	_renderTemplates: function( templates ){
      		var that = this
      		
      		if ( that._hasValues(templates) ) {
      		        		        		  
      		  // now render or link for jsrender
     			  _.each(templates, function(render, name){
     			    log.debug("Rendering template: %s", name)
    			    // render onto given element or default to root widget element
      			  that._renderTemplate( render.id || that.element[0], name, render.data || {} )    			    
    			  })
       		  
      		}     		
      	  
      	},
      	
      	_linkTemplates: function( templates ){
      		var that = this
      		
      		if ( that._hasValues(templates) ) {
      		  
      		  // now render or link for jsrender
     			  _.each(templates, function(render, name){
    			    // render onto given element or default to root widget element
    		      log.debug("Linking template: %s on %s", name, render.id || that.element[0])
      			  that._linkTemplate( render.id, name, render.data )    			    
    			  })
       		  
      		}   		
      	  
      	},

      	_loadTemplates: function( templates ){
      		var that = this
      		
      		if ( that._hasValues(templates) ) {
      		  
      		  // jsrender preloads templates for speed
            // and requires templates feed in as { name: template_text }
        		var tmpl = {}
    		    _.each(templates, function(render, name){
    		      log.debug("Adding template: %s", name)
              tmpl[name] = render.tmpl;
            })

            $.templates(tmpl);
       		  
      		}   		
      	  
      	},
      	
      	_hasValues: function( obj ){
      	  var hasValues = false;

      		if ( typeof obj === "object" && obj !== null ) {
      			_.each( obj, function() {
      				return !(hasValues = true);
      			});
      		}
      		 return hasValues;
      	},
    
      	_renderTemplate: function(el, template, data){
      	  $( el ).append( $.templates[template].render( data ) )
      	},
      	
      	_linkTemplate: function(id, template, data){
      	  // guard for id as #tag
      	  $.link[template]( id, data ); 
      	}
    });
    
    return {
      DEFAULTS: DEFAULTS
    }
 
})
