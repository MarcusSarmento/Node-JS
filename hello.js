var http = require('http');
var dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(localizedFormat);

function servercaallback(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello " + process.argv[2] + ", hoje eh " + dayjs().format('LLL'));
    res.end();
}

http.createServer(servercaallback).listen(8080);
