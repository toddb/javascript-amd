define('coffee/ui', ['utils/log', 'jquery', 'underscore', 'lib/widget', 'lib/ui'], function( log, $, _, widget, ui ){
  
  log.loader('coffee/ui')
  
// Writing a widget posts:
//- http://forum.jquery.com/topic/how-to-write-my-own-widget
//- http://blog.nemikor.com/2010/05/15/building-stateful-jquery-plugins/
//- https://github.com/shichuan/javascript-patterns/blob/master/jquery-plugin-patterns/ui-widget-requirejs-module.html

    // define your widget under the coffee namespace
    widget( "coffee.teller", { 

        // Options to be used as defaults
        options: {}, 
        
        // called with createWidget
        _getCreateOptions: function(){
          // TODO: do something to create non-singleton store
          return { store: [] }
        },

        // Set up widget (e.g. create element, apply theming, bind events, etc.)
        // _create and _init will automatically run the first time & _init thereafter
        // there are number of callbacks - it is worth looking in jquery.ui.widget
        _create: function () {
            this.options.orders = this.options.store;
            this._loadTemplates( _.extend({}, this.options.render, this.options.link) );
            this._renderTemplates( this.options.render );
            this._linkTemplates( this.options.link, this.options.orders );
		        this._createButtons( this.options.buttons );
       },

        // Destroy an instantiated plugin and clean up modifications that the widget has made to the DOM
        _destroy: function () {
            $(this.element[0]).empty()
        },
        
        /* Custom Methods */
        
        addOrder: function( val ){
          // default add on end
          ui.observable(this.options.orders).insert( this.options.orders.length, val);
          this._trigger( "added", this, val )
        },
        
        removeOrder: function( index, numToRemove ){
          // adjust for zero-based index
          var removed = ui.observable(this.options.orders).remove( index - 1, numToRemove || 1)
          this._trigger( 'removed', this, removed )
        },
        
        /* Public options */
        
        // Respond to any changes the user makes to the option method
        _setOption: function ( key, value ) {
            switch (key) {
              case "link":
                 this.options[key] = _.extend({}, this.options[key], value)
                 this._loadTemplates( value )
                 this._linkTemplates( value, this.options.orders )
                 break;
              case "render":
                 this.options[key] = _.extend({}, this.options[key], value)
                 this._loadTemplates( value )
                 this._renderTemplates( value )
                 break;
            default:
                this.options[ key ] = value;
                break;
            }

            this._super( "_setOption", key, this.options[key] );
        },
        
        /* Private methods */
        
        _createButtons: function( buttons ) {
      		var that = this
       		  
    			_.each( buttons, function( props, name ) {
    				props = $.isFunction( props ) ? { click: props, text: name } : props;
    				var btn = $(':contains(' + name + '),:submit[value=' + name +  ']', that.element[0])
    				btn
    					.attr( props, true )
    					.unbind( "click" )
    					.click(function() {
    						props.click.apply( that.element[0], arguments );
    					})
    			});
 
      	},
      	
      	_renderTemplates: function( templates ){
      		var that = this
   			  _.each(templates, function(render, name){
   			    log.debug("Rendering template: %s", name)
  			    // render onto given element or default to root widget element
    			  that._renderTemplate( name, render.into || that.element[0], render.data || {} )    			    
  			  })
      	},
      	
      	_linkTemplates: function( links, store ){
      		var that = this     		      		  
   			  _.each(links, function(link, name){
  			    // render onto given element or default to root widget element
  		      log.debug("Linking template: %s on %s", name, link.into)
    			  that._linkTemplate( name, link.into, store )    			    
  			  })
      	},

      	_loadTemplates: function( templates ){
      		var that = this
      		// templates can arrive in short or long form
      		// (eg { instructions: "<b>bla</b>"} )
      		// short { tmplName: txt } 
      		// long: { tmplName: { tmpl: txt }}
  		    _.each(templates, function(render, name){
  		      txt = (typeof render === 'string') ? render : render.txt
  		      log.debug("Adding template: %s", name, txt)
            that._loadTemplate(name, txt)
          })
      	},
      	     	
      	_loadTemplate: function(name, txt){
      	  ui.templates( name, txt )
      	},
    
      	_renderTemplate: function(name, el, data){
      	  $( el ).append( ui.templates[name].render( data ) )
      	},
      	
      	_linkTemplate: function(name, id, data){
          ui.link[name]( id, data );
      	}
    });
 
})
