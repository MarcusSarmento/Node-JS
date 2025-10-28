var http = require('http');
var request = require('request');

var request_body = undefined;

function createHtmlStringFromJSON(retrievedData) {
    var html_string = '<html>\n<head>\n<title>Data aggregator</title>\n</head>\n<body>\n<table border="1">\n';
    html_string += '<tr>\n';
    for (var attribute in retrievedData[0]) {
        if (typeof retrievedData[0][attribute] !== 'object') {
            html_string += "<th>" + attribute + "</th>\n";
        }
    }
    html_string += "</tr>\n";

    retrievedData.forEach(function (object) {
        html_string += '<tr>\n';
        for (var attribute in object) {
            if (typeof object[attribute] !== 'object') {
                html_string += '<td>' + object[attribute] + '</td>\n';
            }
        }
        html_string += "</tr>\n";
    });
    html_string += "</table>\n</body>\n</html>";
    return html_string;
}

// Faz a requisição inicial à API
request('https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/brisbane-food-trucks/records?limit=20',
    function (err, request_res, body) {
        if (err) {
            console.error("Erro ao buscar dados:", err);
        } else {
            request_body = body;
            console.log("✅ Dados obtidos da API");
        }
    });

http.createServer(function (req, res) {
    if (request_body) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const parsed = JSON.parse(request_body);

        if (parsed.results && parsed.results.length > 0) {
            res.end(createHtmlStringFromJSON(parsed.results));
        } else {
            res.end("<h2>Nenhum dado disponível</h2>");
        }
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("⏳ Carregando dados... Atualize em alguns segundos.");
    }
}).listen(8080, () => console.log("🌐 Servidor rodando em http://localhost:8080"));
