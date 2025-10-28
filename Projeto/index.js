var http = require('http');
var request = require('request');

var request_body = undefined;

request = ('https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/brisbane-food-trucks/records?limit=20',
    function(error, request_res, body){
        request_body = body;
    }
);

http.createServer(function(req, res){
    if(request_body){
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(request_body);
    }else{
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end('Nada encontrado');
    }
    
}).listen(8080);