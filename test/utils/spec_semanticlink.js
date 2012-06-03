describe("Semantic link", function() {
  
  var link;
  
  beforeEach( _requires(['utils/semanticLink'], function(l){ link = l }));
  
  describe("HEAD", function() {
    
    beforeEach(function() {
      $('<link rel="collection" type="text/html" href="http://semanticlink-test">').prependTo('HEAD')      
    });

    it("filters links from HEAD", function() {
      expect(link.filter('HEAD', 'collection', 'text/html')).toEqual( [{ href : 'http://semanticlink-test/', rel : 'collection', type : 'text/html' }] );
    });
    
    it("filters links", function() {
      expect(link.filter($('head')[0], 'collection', 'text/html')).toEqual( [{ href : 'http://semanticlink-test/', rel : 'collection', type : 'text/html' }] );
    });
    
    it("should get href uri", function() {
      expect(link.getUri('HEAD', 'collection', 'text/html')).toEqual( 'http://semanticlink-test/' );
    });
       
    afterEach(function() {
      $('link[rel="collection"]').remove()
    });
       
  });
  
  describe("GET", function() {

     beforeEach(function() {
       $('<link rel="collection" type="text/html" href="http://semanticlink-test">').prependTo('HEAD')  
     });

     it("should trigger failure callback", function() {
       var onFailure = jasmine.createSpy();
       
       $.mockjax({
         url: '*',
         headers: { Accept: 'text/html'},
         status: 500
       });
       
       link
        .get('HEAD', 'collection', 'text/html')
        .fail( onFailure )
     
        waitsFor(function() {
          return onFailure.wasCalled;
        });
 
     });

     afterEach(function() {
       runs(function(){
        $.mockjaxClear()         
        $('link[rel="collection"]').remove()
       })
     });

   });
  
  describe("LINKS", function() {
    
    var links

    beforeEach(function() {
      links = [
          { "rel": "alternate", "type": "text/html", "href": "http://semanticlink-test:8888/Cluster/Index/1" },
          { "rel": "alternate", "type": "application/json", "href": "http://semanticlink-test:8888/Cluster/.json/1" },
          { "rel": "notes", "type": "application/json", "href": "http://semanticlink-test:8888/Cluster/1/Note"},
          { "rel": "map-preferences", "type": "application/json", "href": "http://semanticlink-test:8888/Cluster/MapPreferences/1"},
          { "rel": "areas", "type": "application/json", "href": "http://semanticlink-test:8888/Cluster/Area/1"},
          { "rel": "troughs", "type": "application/json", "href": "http://semanticlink-test:8888/Cluster/Trough/1" }
      ]      
    });
    
    it("filters on string match", function() {
      expect(link.filter(links, 'notes', 'application/json').length).toEqual(1)
      expect(link.filter(links, 'alternate', 'application/json').length).toEqual(1)
    });
 
    it("filters on * wildcard", function() {
      expect(link.filter(links, 'alternate', '*').length).toEqual(2)
      expect(link.filter(links, '*', 'application/json').length).toEqual(5)
      expect(link.filter(links, '*', '*').length).toEqual(6)
    });
    
    it("filters on regular expression", function() {
      expect(link.filter(links, /troughs/i, "*").length).toEqual(1);
      expect(link.filter(links, '*', /application/i).length).toEqual(5);
    });   
  });
  
  describe("POST", function() {
    
    var resource

    beforeEach(function() {
      // a sample resouce with both the links and the json respresentation/payload
      resource = {
        "links": [
          { "rel": "collection", "type": "application/json", "href": "http://localhost:8888/orders/current"},
          { "rel": "self", "type": "application/json", "href": "http://localhost:8888/orders/1"},
          { "rel": "edit", "type": "text/html", "href": "http://localhost:8888/orders/1"},
        ],
        "type": "small", 
      }
       
    });
    
    it("should create on a collection", function() {
     var onSuccess = jasmine.createSpy();
     var onFailure = jasmine.createSpy();
 
     // match on the url from the collection
     $.mockjax({
       url: 'http://localhost:8888/orders/current',
       type: 'POST',
       responseText: { me: "this"},
       async: false
     });
 
 // we should POST on a collection. As such the collectin is the factory for the
 // creation of new resources - not tested here but the POST should then return
 // the Location of that created resource for a GET - but that is the functionality of the server
 // and quite another set of tests that aren't worth simulating. Also, at this point, we are not
 // mapping the json representation (self) from the html form representation (edit). Instead,
 // I have just hand-coded the representation as { type: "small" }
     link
      .post(resource, 'collection', 'application/json', { type: "small" }, 'json')
      .fail( onFailure )
      .done( onSuccess )

      waitsFor(function() {
        return onSuccess.wasCalled;
      });

      runs(function(){
        expect(onFailure).wasNotCalled();         
      })

    });

    afterEach(function() {
     runs(function(){
      $.mockjaxClear()         
     })
    });
    
  });

});