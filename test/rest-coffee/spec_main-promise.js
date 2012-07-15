describe("Layered, loading rest coffee", function () {

    beforeEach(function () {
        $('<link rel="collection" type="application/json" href="http://localhost:8888/orders/current">').prependTo('HEAD')

        // response for the collection
        $.mockjax({
            url:'*/orders/current',
            type:'GET',
            headers:{ 'Accept':'application/json' },
            responseText:require('json!server/orders/current.json')
        })

        // return for (same response text)
        // * http://localhost:8888/orders/1
        // * http://localhost:8888/orders/2
        // * http://localhost:8888/orders/3
        // * http://localhost:8888/orders/4
        $.mockjax({
            url:'*/orders/*',
            type:'GET',
            headers:{ 'Accept':'application/json' },
            responseText:require('json!server/orders/1.json')
        })

        // match on the url from the collection http://localhost:8888/orders
        $.mockjax({
            url:'*/orders',
            type:'POST',
            responseText:require('json!server/orders/1.json'),
            // and return Location header http://localhost:8888/orders/4 of the created resource
            headers:{Location:'http://localhost:8888/orders/4' },
            async:true
        });

    });

    describe("Loading and displaying current orders,", function () {

        beforeEach(_requires(['rest-coffee-promise/main'], function (main) {
            var that = this
            $.when( main.init() )
                .done(function( ){
                    that.widget = this
                    that.isLoaded = true;
                })
        }));

        describe("Load up and click to enter new", function () {

            beforeEach(function () {

                waitsFor(function () {
                    return this.isLoaded
                }, 'page to load with data')

                runs(function () {
                    // click the button
                    $('button.order', this.widget).click()
                    // and the new order is displayed
                    expect($('#new-coffee', this.widget).is(':visible')).toBeTruthy();
                })


            });

            it("Add new", function () {
                // select a new order
                $('input', $('#new-coffee')).val('small')
                // submit
                $(':submit', $('#new-coffee', this.widget)).click()


                waitsFor(function () {
                    return $('li', this.widget).size() == 4
                }, 'new order to be added')

                runs(function () {
                    // and we've hidden the form
                    expect($('#new-coffee', this.widget).is(':visible')).toBeFalsy();
                })

            });

        });

    });

    afterEach(function () {
        $.mockjaxClear();
        $('link[rel="collection"]').remove()
        this.widget.remove()
    });

});