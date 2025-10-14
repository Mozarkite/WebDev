var http = require('http');
var url = require('url');
var fs = require('fs');


http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    if (q.pathname == '/')
        var file = (__dirname + "/index.html");


    else file = (__dirname + q.pathname);

    fs.readFile(file, function(err, data){
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    
});
}).listen(3000);
// starts a simple http server locally on port 3000
console.log("Server running at http://localhost:3000/");