var http = require('http');
var dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

function servercaallback(req, res) {
    /*res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello " + process.argv[2] + ", hoje eh " + dayjs().format('LLL'));
    res.end();*/

    var begin_time = dayjs("7:00","HH:mm");
    var end_time = dayjs("17:00","HH:mm");

    var message = "Ola " + process.argv[2] + "! \n";
    message += "Seja bem vindo a nossa pagina \n";
    message += "Agora sao " + dayjs().format("HH:mm") + ". \n";
    message += "Funcionamos de " + begin_time.format('HH:mm') + " ate " + end_time.format('HH:mm') + ". \n";
    
    var begin_difference =  begin_time.diff(dayjs(), 'minutes');
    var end_difference = dayjs().diff(end_time, 'minutes');

    if (begin_difference > 0) {
        message += "Retorne em " + begin_difference + " minutos. \n";
    } 
    if(end_difference > 0) {
        message += "Por favor, retorne amanha! \n";
    }
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(message);
}

http.createServer(servercaallback).listen(8080);
