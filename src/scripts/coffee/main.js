define("coffee/main", 
['utils/log', 'jquery', 'coffee/loader',
'text!coffee/views/index.html',
'text!coffee/views/_item.html',
'text!coffee/views/_new.html'
], 
function( log, $, loader, index, item_, new_ ){
  
  log.loader("coffee/main")
    
  $( function(){
    
    loader.init({
      instructions: {
        tmpl: index
      },
      orders: {
        tmpl: item_,
        items: fakeGet()
      },
      newOrder: {
        tmpl: new_
      },
      add: {
        click: fakeAjaxSet
      }
    })
    
  })
  
  function fakeGet(){

     // TODO: this will do for now
     var now = new Date()
     now.setSeconds(now.getSeconds() - 10)
     var tensecondsago = now.toUTCString();
     now.setMinutes(now.getMinutes() - 1)
     var oneminuteago = now.toUTCString();
     now.setMinutes(now.getMinutes() - 9)
     var tenminutessago = now.toUTCString();

     return [
     	{ type: "small", ordered: tensecondsago },
     	{ type: "small", ordered: oneminuteago },
     	{ type: "small", ordered: tenminutessago }
     ]
   }

   function fakeAjaxSet( val ){
     log.debug("update! - not really")
     // we'd likely return $.ajax() because it returns a promise - so for now we'll just return our own promise
     var result = new $.Deferred();
     var now = new Date();
     var order = { type: 'small', ordered: now.toUTCString() }
     result.resolveWith( this, [order, null, null] )
     return result.promise()
   }
  
  
});