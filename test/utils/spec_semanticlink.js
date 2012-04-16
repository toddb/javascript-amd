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
  
  xdescribe("GET", function() {

     beforeEach(function() {
       $('<link rel="collection" type="text/html" href="http://semanticlink-test">').prependTo('HEAD')
     
     });

     xit("should get", function() {
       spyOn($, 'ajax')
       
       link.get('HEAD', 'collection', 'text/html')
       
       expect($.ajax).wasCalledWith({ 
         type : 'GET', 
         url : 'http://semanticlink-test/', 
         data : null, 
         dataType : null,
         contentType : 'text/html',
         beforeSend : jasmine.any(Function) });
         
     });

     it("should trigger failure callback", function() {
       var onFailure = jasmine.createSpy();
       
       $.mockjax({
         url: '*',
         headers: { Accept: 'text/html'}
       });
       
       link
        .get('HEAD', 'collection', 'text/html')
        .fail( onFailure )
     
        waitsFor(function() {
          return onFailure.wasCalled;
        });
        
        $.mockjaxClear()
     });

     afterEach(function() {
       $('link[rel="collection"]').remove()
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

});