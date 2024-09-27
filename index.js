const http = require('http');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { extract_text } = require('./extract_text');

const port = 8081;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/pdf_to_text') {
        let body = '';

        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const pdf_url = JSON.parse(body).data.url;
            const pdf_file = path.join(__dirname, `temp_${Date.now()}.pdf`);

            https.get(pdf_url, response => {
                response.pipe(fs.createWriteStream(pdf_file).on('finish', async () => {
                    try {
                        const text = await extract_text(pdf_file);
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({ text }));
                    } catch {
                        res.writeHead(500).end(JSON.stringify({ error: 'Failed to extract text' }));
                    }
                }));
            }).on('error', () => {
                res.writeHead(500).end(JSON.stringify({ error: 'Failed to download PDF' }));
            });
        });
    } else {
        res.writeHead(404).end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
