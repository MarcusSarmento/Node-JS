var http = require('http');

function servercaallback(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello " + process.argv[2]);
    res.end();
}

http.createServer(servercaallback).listen(8080);
