describe("ui, events", function() {
  
  beforeEach(_requires(["coffee/ui"], function( l ){ loader = l }));
  
  // it("should be able to register add order handler for a FORM and have it invoked on click", function() {
  //   
  //   $('<form id="handler">').appendTo('#test')
  //   spyOn(loader, 'add').andCallThrough()
  //   var promise = jasmine.createSpy().andReturn( data );
  // 
  //   loader.orderHandler( '#test', promise )
  //   
  //   $('#handler').submit()
  //   
  //   expect(loader.add).toHaveBeenCalledWith( data )
  //   expect(promise).toHaveBeenCalled()
  // });
  
  it("should return DEFAULTS", function() {
    expect(loader.DEFAULTS).not.toBeNull();
  });
  
  xit("should attach widget to dom element", function() {
      el = $('#test').teller( loader.DEFAULTS );
      el.teller('destroy')
  });
  
});

describe("ui, templates", function() {
  
  var el, loader, settings,
    instructions = "<b>hi<ul id='instructionslist'></ul></b>",
    
    item = "<li>{{:val}}</li>",
    data = { val: 'me' },
    
    coffeeTypes = [{type:'small'}],
    newOrder = "<select>{{:type}}</select>",
    
    render = {
        instructions: {
          tmpl: instructions
        } 
      }

  beforeEach(_requires(["coffee/ui"] ));
  
  it("should render instructions with the list wrapper", function() {
     el = $('#test').teller( { render: render });
     expect($('#instructionslist').size()).toEqual(1);
  });
  
  it("should link list to instructions", function() {
    var link = {
      orders: {
        tmpl: item,
        data: data,
        id: '#instructionslist'
      }      
    }
    el = $('#test').teller( { render: render, link: link } );
    expect($('#instructionslist>li', el).size()).toEqual(1);    
  });
  
  afterEach(function() {
   el.teller('destroy')
  });

});

xdescribe("ui, options", function() {
  
  describe("buttons", function() {
    
    it("should callback on Add", function() {
      
      var buttons = {
        'Order New Coffee': function(ev, ui){
          expect(this).toEqual(el[0], "content of callback");
        }
      }
      
      el = $('<div>').teller( { buttons: buttons });
      btn = $("button", el)
      
      expect(btn.length).toEqual(1, "number of buttons");
      
      btn.click();
      
      newButtons = {
    		"Close": function(ev, ui) {
    			equal(this, el[0], "context of callback");
    			equal(ev.target, btn[0], "event target");
    		}
    	};
    	
    	expect(el.teller("option", "buttons")).toEqual(buttons, '.teller("option", "buttons") getter');
    	el.teller("option", "buttons", newButtons)
    	expect(el.teller("option", "buttons")).toEqual(newButtons, '.teller("option", "buttons") getter');
    	
      
      el.teller('destroy')
    });
    
    
  });
  
});