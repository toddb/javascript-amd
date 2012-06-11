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
          tmpl: "<b>hi<ul id='instructionslist'></ul></b>"
        } 
    },
    link = {
      orders: {
        tmpl: "<li>{{:val}}</li>",
        data: { val: 'me' },
        id: '#instructionslist'
      }      
    }
  
  it("should render instructions with the list wrapper", function() {
     el = $('#test').teller( { render: render });
     expect($('#instructionslist').size()).toEqual(1);
  });

  it("should render select using options", function() {
    el = $('#test').teller();
    el.teller('option', 'render', render)
    expect($('#instructionslist').size()).toEqual(1);

  });
  
  it("should link list to instructions", function() {
    el = $('#test').teller( { render: render, link: link } );
    expect($('#instructionslist>li', el).size()).toEqual(1);    
  });
  
  
  it("should link list to instructions via options", function() {
    el = $('#test').teller( { render: render } );
    el.teller('option', 'link', link)
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
          Ok: {
            tmpl: "<button type='button'>Ok</button>"
          }
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