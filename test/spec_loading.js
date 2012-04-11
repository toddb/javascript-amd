describe("Loading the views", function() {
  var loader, settings,
    instructions = "<b>hi<ul id='list'></ul></b>",
    item = "<li>{{:val}}</li>",
    data = { val: 'me' }

  beforeEach(_requires(["coffee/loader"], function( l ){ 
    loader = l;
    settings = {
        instructions: {
          id: '#test',
          tmpl: instructions
        },
        orders: {
          id: '#list',
          tmpl: item,
          items: data
        },
        add: {
          id: '#coffee .order',
          click: function(){ 
            return {} 
          }
        }
      }
  }));
  
  it("should load instructions and all currently ordered coffees", function() {

    spyOn(loader, 'renderParent').andCallThrough()
    spyOn(loader, 'loadTemplates').andCallThrough()
    spyOn(loader, 'renderChild').andCallThrough()

    loader.init( settings );
    
    expect(loader.loadTemplates).toHaveBeenCalledWith( instructions, item )
    expect(loader.renderParent).toHaveBeenCalledWith( "#test", {} )
    expect(loader.renderChild).toHaveBeenCalledWith( "#list", data )
  });
  
  describe("Rendering existing orders", function() {

    it("should render one row", function() {
      loader.init( settings );
      expect($('#test #list>li').size()).toEqual(1);
      expect($('#list>li').text()).toEqual('me');   
    });

    it("should render two rows", function() {
      settings.orders.items = [data, data]
      loader.init( settings );
      expect($('#test #list>li').size()).toEqual(2);
    });
      
  });

  afterEach(function() {
    $('#test').empty()
  });
  
  
});