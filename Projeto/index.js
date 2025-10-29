var http = require('http');
var https = require('https');
var fs = require('fs');
var { parse } = require('csv-parse/sync'); // <-- troca simples e compatível

var request_body = undefined;
var html_content = undefined;

function createHtmlStringFromCsv(retrievedData) {
    var body_begin_index = html_content.indexOf('<body>');
    var body_end_index = html_content.indexOf('</body>');

    var string_until_body = html_content.slice(0, body_begin_index + 6);
    var string_from_body = html_content.slice(body_end_index);

    if (!Array.isArray(retrievedData) || retrievedData.length === 0) {
        return string_until_body + "<p>Nenhum dado encontrado.</p>" + string_from_body;
    }

    var html_string = '<table border="1" style="border-collapse: collapse; width: 100%;">\n';
    html_string += '<tr style="background-color:#ddd;">\n';
    retrievedData[0].forEach(function (attribute) {
        html_string += "<th>" + attribute + "</th>\n";
    });
    html_string += "</tr>\n";

    var data = retrievedData.slice(1);
    data.forEach(function (row) {
        html_string += '<tr>\n';
        row.forEach(function (cell) {
            html_string += '<td>' + cell + '</td>\n';
        });
        html_string += "</tr>\n";
    });
    html_string += "</table>";
    return string_until_body + html_string + string_from_body;
}

/*
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
*/

// Baixa o CSV corretamente
https.get(
    'https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/brisbane-food-trucks/exports/csv?lang=en&timezone=America%2FArgentina%2FBuenos_Aires&use_labels=true&delimiter=%2C',
    function (response) {
        let csvData = '';
        response.on('data', (chunk) => {
            csvData += chunk;
        });
        response.on('end', () => {
            try {
                const records = parse(csvData); // <-- agora funciona corretamente
                request_body = records;
                console.log('✅ CSV carregado com sucesso!');
            } catch (err) {
                console.error('❌ Erro ao parsear CSV:', err.message);
            }
        });
    }
);

http.createServer(function (req, res) {
    if (request_body && html_content) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(createHtmlStringFromCsv(request_body));
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("⏳ Carregando dados, aguarde alguns segundos...");
    }
}).listen(8080, () => {
    console.log("🚀 Servidor rodando em http://localhost:8080");
});

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err;
    }
    html_content = html.toString();
    console.log('✅ index.html carregado!');
});
