describe("ui, loading", function() {
  
  beforeEach(_requires(["coffee/ui"]));
  
  it("should attach widget to dom element", function() {
      el = $('#test').teller();
      expect(el.html()).toBe("");
      el.teller('destroy')
      expect(el.html()).toBe("");
  });
  
});

describe("ui, templates - render & link", function() {
  
  var el,  
    render = {
        instructions: {
          txt: "<b>hi<ul id='instructionslist'></ul></b>"
        } 
    },
    link = {
      orders: {
        txt: "<li>{{:val}}</li>",
        into: '#instructionslist'
      }      
    },
    order = { val: 'me' }
  
  it("should render instructions with the list wrapper", function() {
     el = $('#test').teller( { render: render });
     expect($('#instructionslist').size()).toEqual(1);
  });

  it("should render instructions with the list wrapper - short form", function() {
     el = $('#test').teller( { render: { instructions: render.instructions.txt } });
     expect($('#instructionslist').size()).toEqual(1);
  });
  
  it("should render select using options", function() {
    el = $('#test').teller();
    el.teller('option', 'render', render)
    expect($('#instructionslist').size()).toEqual(1);

  });

  it("should render select using options - short form", function() {
    el = $('#test').teller();
    el.teller('option', 'render', { instructions: render.instructions.txt })
    expect($('#instructionslist').size()).toEqual(1);

  });
    
  it("should render linked list", function() {
    el = $('#test').teller( { render: render, link: link } );
    // now add order
    el.teller('addOrder', order)
    expect($('#instructionslist>li', el).size()).toEqual(1);    
  });
  
  
  it("should link list to instructions via options", function() {
    el = $('#test').teller( { render: render } );
    el.teller('option', 'link', link)
    // now add order
    el.teller('addOrder', order)
    expect($('#instructionslist>li', el).size()).toEqual(1);    
    
    expect(el.teller('option', 'link')).toEqual(link, '.teller("option", "buttons") getter');
  });
  
  afterEach(function() {
   el.teller('destroy')
  });

});

describe("ui, buttons", function() {
     
    it("should callback on Add", function() {
      
      var ok_click = jasmine.createSpy(),
        render = {
          Ok:  "<button type='button'>Ok</button>"
        },
        buttons = {
          Ok: function(ev, ui){
            ok_click()
            expect(this).toEqual(el[0], "content of callback");
            expect(ev.target).toEqual(btn[0], "event target");
          }
        }
      
      el = $('#test').teller( { buttons: buttons, render: render });
      btn = $("button", el)
      
      expect(btn.length).toEqual(1, "number of buttons");
      
      // check handler is called
      btn.click();
      expect(ok_click).toHaveBeenCalled()
      
      newButtons = {
    		Close: function(ev, ui) {}
    	};
    	
    	expect(el.teller("option", "buttons")).toEqual(buttons, '.teller("option", "buttons") getter - original set');
    	el.teller("option", "buttons", newButtons)
    	expect(el.teller("option", "buttons")).toEqual(newButtons, '.teller("option", "buttons") getter - newly added');
    	
      
      el.teller('destroy')
    });

});

describe("methods, order", function() {
  
  it("should add an order to the store", function() {
    // load up and callback after create
    var create = jasmine.createSpy();
    el.teller({create: function(ev,ui){
      create()
    }})
    expect(create).toHaveBeenCalled();
    expect(el.teller('option', 'orders')).toEqual([], "orders should be empty");
    
    // also check that the orderAdded callback is performed
    var ok = jasmine.createSpy();
    el.teller()
    el.teller('option', "added", function(ev,val){
      ok() // here we could put our dateFormatter
    })
    el.teller('addOrder', { me: 'val' })
    expect(el.teller('option', 'orders')).toEqual([{ me: 'val' }], 'orders should now have one added'); 
    expect(ok).toHaveBeenCalled();
    
    var stopped = jasmine.createSpy()
    el.teller('option', 'removed', function(){
      stopped()
    })
    
    el.teller('removeOrder', 1)
    expect(el.teller('option', 'orders')).toEqual([], 'orders should now be empty again'); 
    expect(stopped).toHaveBeenCalled();
    
  });
  
  
});