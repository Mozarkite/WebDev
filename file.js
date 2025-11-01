var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filePath;

    //Serve static files 
    var extname = path.extname(q.pathname);
    var staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico'];

    if (staticExtensions.includes(extname)) {
        filePath = path.join(__dirname, q.pathname);
    } else {
        // For all other routes, return index.html
        filePath = path.join(__dirname, 'index.html');
    }

    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }

        //Determine content type
        let contentType = 'text/html';
        if (extname === '.css') contentType = 'text/css';
        else if (extname === '.js') contentType = 'application/javascript';
        else if (['.png', '.jpg', '.jpeg', '.gif', '.ico'].includes(extname)) contentType = 'image/' + extname.slice(1);

        res.writeHead(200, {'Content-Type': contentType});
        res.write(data);
        return res.end();
    });
}).listen(3000);

console.log("Server running at http://localhost:3000/");
