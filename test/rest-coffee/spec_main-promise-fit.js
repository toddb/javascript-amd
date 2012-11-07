
describe("Promise-FIT, loading rest coffee", function() {
  
  beforeEach(function() {
    $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD')
  });

  load(['rest-coffee-promise/main', 'render orders'], function(){

        gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'));
        showing('text!coffee/views/index.html', 'text!coffee/views/_item.html', 'text!coffee/views/_new.html');
        gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json'));
        gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/1.json'));
        gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/1.json'));
   
        using(function(){

          expecting("three orders to be rendered", function(){ 
            return $('ul#coffee-orders>li', this.widget).size() >= 3 
          }) 

        })
   
     }
   )

  load(['rest-coffee-promise/main', 'add order'], function(){

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

      expecting("four orders to be rendered", function(){ 
        return $('ul#coffee-orders>li', this.widget).size() >= 4 
      }) 

    })

    _$('#new-coffee')
    became(':hidden')
    was('clicked')

    posts('http://localhost:8888/orders', Json, returning(OK, { Location: 'http://localhost:8888/orders/4'}));
    gets('http://localhost:8888/orders/4', Json, returning(OK, 'json!server/orders/1.json'));

  })
  
  xload(['rest-coffee-promise/main', 'delete order'], function(){

    gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'));
    gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json', { Allow: "DELETE" }));
    gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/2.json', { Allow: "DELETE" }));
    gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/3.json'));
    
    using(function(){
      
      expecting("the list to be rendered with delete buttons", function(){ 
        return $(':submit[value=Delete]', this.widget).size() === 2
      })
      
      runs( function(){
         $(':submit[value=Delete]:first', this.widget).click()
      })
      
      expecting("two orders only to be showing because one was deleted", function(){ 
        return $('ul#coffee-orders>li').size() == 2 
      })
      
    })
    
    deletes('http://localhost:8888/orders/1', returning(OkNoEntity));

  })

  load(['rest-coffee-promise/main', 'update order'], function(){

    gets('http://localhost:8888/orders/current', Json, returning(OK, 'json!server/orders/current.json'));
    gets('http://localhost:8888/orders/1', Json, returning(OK, 'json!server/orders/1.json', { Allow: "DELETE,PUT" }));
    gets('http://localhost:8888/orders/2', Json, returning(OK, 'json!server/orders/2.json', { Allow: "DELETE" }));
    gets('http://localhost:8888/orders/3', Json, returning(OK, 'json!server/orders/3.json'));
    
    using(function(){
      
      expecting("the list to be rendered", function(){ 
        return $('ul#coffee-orders>li').size() == 3
      })
      
      runs( function(){
         var item = $('a[rel=edit][href=http://localhost:8888/orders/1]', this.widget)
         
         item.click()
         console.error(item)
         $(':input[name=type][type=text]').val('large-xxx')
         $(':submit[value=Update]').click()
      })
      
    })
    
    var update = {
      "type": "large-xxx"
    }
    
    puts('http://localhost:8888/orders/1', Json, update, returning(OkNoEntity));

  })
  
  afterEach(function () {
    $('link[rel="collection"]').remove()
  });
  
});
