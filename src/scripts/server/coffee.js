var port = process.argv[2] || 8888;

var router = require('../../../lib/node-rest-router')
     
// Load the node-router library by creationix
var server = router.getServer({ 
  basePath: 'src/scripts/server/',
  logger: console.log
});

// Configure our HTTP server to respond
server.get("/orders/current", 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', function(req, res){
  res.html(200, "../../app-rest.html")
} )
server.get("/orders/current", 'application/json', function (req, res) {
  res.json(200, "orders/current.json");
});

server.get("/orders/1", 'application/json', function (req, res) {
  res.json(200, "orders/1.json", [['Allow', 'DELETE']] );
});

server.get("/orders/2", 'application/json', function (req, res) {
  res.json(200, "orders/2.json" );
});

server.get("/orders/3", 'application/json', function (req, res) {
  res.json(200, "orders/3.json", [['Allow', 'DELETE']]);
});

server.get("/orders/.*", 'application/json', function (req, res) {
  res.json(200, "orders/1.json"/* , [['Allow', 'DELETE']]*/);
});

server.get("/orders/.*", "*", router.staticDirHandler('./src',   '/orders') )
server.get("/build/.*", "*",  router.staticDirHandler('./build', '/build') )

server.post("/orders", '*', function(req, res){
  res.created( '/orders/1.json' )
})

server.del("/orders/3", "*", function(req, res){
  res.successDeleteNoEntity()
})

// Listen on port on localhost
server.listen(parseInt(port, 10), "localhost");

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");