const http = require('http');
const fs = require('fs');
const path = require('path');
const regex = require('./regex');

const PORT = 8081;

http.createServer((request, response) => {
    let filePath;

    const url = request.url;
    if (regex.isCodeResource(url) || url === '/') {
        if (url === '/') {
            filePath = './dist/index.html';
        } else {
            filePath = getFilePath(url);
        }

        fs.readFile(filePath, function(error, content) {
            const contentType = getContentType(filePath);
    
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        });
    }

}).listen(PORT);

function getFilePath(fileUrl) {
    return "."+fileUrl;
}

function getContentType(filePath) {
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        }
    return contentType;
}
