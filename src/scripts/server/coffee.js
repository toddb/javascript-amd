var port = process.argv[2] || 8888;

var router = require('../../../lib/node-rest-router')
     
// Load the node-router library by creationix
var server = router.getServer({ 
  basePath: 'src/scripts/server/'
});

// Configure our HTTP server to respond
server.get("/orders/current", 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', function(req, res){
  res.html(200, "../../app-rest.html")
} )
server.get("/orders/current", 'application/json', function (req, res) {
  res.json(200, "orders/current.json");
});

server.get("/orders/.*", 'application/json', function (req, res) {
  res.json(200, "orders/1.json");
});

server.get("/orders/.*", "*", router.staticDirHandler('./src',   '/orders') )
server.get("/build/.*", "*",  router.staticDirHandler('./build', '/build') )

// Listen on port on localhost
server.listen(parseInt(port, 10), "localhost");

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");