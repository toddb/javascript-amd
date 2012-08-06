describe('proxy', function(){
	var proxy, clazz = {}
		
	beforeEach(_requires(['proxy'], function(p){ proxy = p }));
	
	describe("empty", function() {
		
		beforeEach(function() {
			proxy.init()
			expect(proxy.overrides.length).toEqual(0);
			
		  nocall = jasmine.createSpy('NO CALL')
			called = jasmine.createSpy('CALLED')
			clazz.method = nocall;
		});
		
		it("should not call with no proxy", function() {
			clazz.method()
			expect(nocall).wasCalled();
			expect(called).not.wasCalled();
		});
			  
		it("should not call old method", function() {
		  proxy.override(clazz, 'method', called)
			clazz.method()
			expect(nocall).not.wasCalled();
			expect(called).wasCalled();
		});

		it("should add to overrides and increase guid", function() {
			var guid = proxy.guid
		  proxy.override(clazz, 'method', called)
		  expect(clazz.method.guid).not.toEqual(guid);
		  expect(proxy.guid).not.toEqual(guid);
			expect(proxy.overrides.length).toEqual(1);
			expect(proxy.overrides[0].guid).toEqual(clazz.method.guid);
			expect(proxy.overrides[0].guid).toEqual(proxy.guid);
		});
		
		it("should not add multiple overrides on same method", function() {
		  // TODO: it will orphan first overriden method
		  proxy.override(clazz, 'method', nocall)
		  proxy.override(clazz, 'method', called)
		  clazz.method()
			expect(proxy.overrides.length).toEqual(2);
			expect(nocall).not.wasCalled();
			expect(called).wasCalled();			
		});
		
		it("should not error on method not found", function() {
		  proxy.override(clazz, 'methodnotfound', called)
			expect(proxy.overrides.length).toEqual(1);
		});
		
		describe("reset", function() {
			
			beforeEach(function() {
				clazz.method = called
			  proxy.override(clazz, 'method', nocall)
				expect(proxy.overrides.length).toEqual(1);
			});

			it("should call original method from reset", function() {
				proxy.reset(clazz.method.guid)
				
				clazz.method()
				
				expect(called).wasCalled();
				expect(nocall).not.wasCalled();			
			});

			it("reset proxy resets only one override", function() {
				proxy.reset(clazz.method.guid)
				expect(proxy.overrides.length).toEqual(0);
			});

			it("resetAll proxy clears all overrides", function() {
				proxy.resetAll()
				expect(proxy.overrides.length).toEqual(0);
			});			
		  
		});
		
		describe("multiple reset", function() {
		  beforeEach(function() {
		    proxy.override(clazz, 'method', nocall)
			  proxy.override(clazz, 'method', called)
				expect(proxy.overrides.length).toEqual(2);
		  });
		
			it("should reset only one of two", function() {
				proxy.reset(clazz.method.guid)
				expect(proxy.overrides.length).toEqual(1);
			});

			it("should reset multiple", function() {
				proxy.resetAll()
				expect(proxy.overrides.length).toEqual(0);
			});
		});
		
	});
	
})