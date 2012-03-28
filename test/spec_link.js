describe("Managing data", function() {
  var _

  beforeEach(_requires(["coffee/link"], function(){ _ = arguments[0] }));
  
  it("should load data", function() {
    var coffees = _.get()
    expect(coffees.length).toEqual(3)
    expect(coffees[0].type).toEqual("small")
  });

  describe("Setting data", function() {

    it("should be able to set data", function() {
       expect(_.set).toBeDefined();
     });
    
  });

});