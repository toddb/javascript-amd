
describe("Promise (returning promise) functional test", function() {
	
	var init = function(tests){

    gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'));
    showing('text!coffee/views/index.html', 'text!coffee/views/_item.html', 'text!coffee/views/_new.html');
    gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json'));
    gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/1.json'));
    gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/1.json'));

    using(function(){

        $('button.order', this.widget).click()
        expect($('#new-coffee', this.widget).is(':visible')).toBeTruthy();

        $( 'input', $('#new-coffee')).val('small');  
        $( ':submit', $('#new-coffee')).click();		  

    })

		tests();
		
    posts('http://localhost:8888/orders', Json, returning(OK, { Location: 'http://localhost:8888/orders/4'}));
    gets('http://localhost:8888/orders/4', Json, returning(OK, 'json!server/orders/1.json'));
		
	}

  beforeEach(function() {
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD')
  });

  load(['rest-coffee-promise/main', 'using explicit selector for both was and became'], function(){

      init( function(){
		  	was('clicked', '#new-coffee')
		  	became('#new-coffee', ':hidden')
			})
    }
  )

  load(['rest-coffee-promise/main', 'using implicit selector for second for became'], function(){

    	init( function(){
		  	was('clicked', '#new-coffee')
		  	became('#new-coffee', ':hidden')
			})

     }
  )

  load(['rest-coffee-promise/main', 'using implicit on second but for was'], function(){

    	init( function(){
		  	became('#new-coffee',':hidden')
		  	was('clicked')
			})

    }
  )

  load(['rest-coffee-promise/main', 'using explicit selector setting and then others all implicit'], function(){

	  	init( function(){
				_$('#new-coffee')
		  	became(':hidden')
		  	was('clicked')
			})

    }
  )

	describe("Ignore because of xload", function() {

	  xload('rest-coffee-promise/main', function(){})

	});
  
});
