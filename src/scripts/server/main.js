
// We actually have a number of options for the server and it is as much based on the server's capabilities
// 
// `"http://localhost:8888/orders/.json/1"`
// `"http://localhost:8888/orders/1.json"`
// `"http://localhost:8888/orders/1?accept=json"`
// `"http://localhost:8888/orders/1?a=json"`
// `"http://localhost:8888/orders/1/accept/json"`

require(
    [
        'json!server/orders/1.json',
        'json!server/orders/2.json',
        'json!server/orders/3.json',
        'json!server/orders/current.json'
    ]
);
