describe("Loading the views", function() {
  var _, 
    template = "<b>hi<ul id='list'></ul></b>",
    item = "<li>{{:val}}</li>",
    data = { val: 'me' }

  beforeEach(_requires(["coffee/loader"], function(){ _ = arguments[0] }));
  
  it("should load instructions and all currently ordered coffees", function() {
    spyOn(_, 'renderParent').andCallThrough()
    spyOn(_, 'loadTemplates').andCallThrough()
    spyOn(_, 'renderChild').andCallThrough()

    _.init('#test', template, '#list', item, data, null, null, _ );
    
    expect(_.loadTemplates).toHaveBeenCalledWith( template, item )
    expect(_.renderParent).toHaveBeenCalledWith( "#test", {} )
    expect(_.renderChild).toHaveBeenCalledWith( "#list", data )
  });
  
  describe("Rendering existing orders", function() {

    it("should render one row", function() {
      _.init('#test', template, '#list', item, data );
      expect($('#test #list>li').size()).toEqual(1);
      expect($('#list>li').text()).toEqual('me');   
    });

    it("should render two rows", function() {
      _.init('#test', template, '#list', item, [data, data] );
      expect($('#test #list>li').size()).toEqual(2);
    });
      
  });

  afterEach(function() {
    $('#test').empty()
  });
  
  
});