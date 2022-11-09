let http = require('http');
let url = require('url');
let fs = require('fs');


let server = http.createServer();
server.on('request', async (request, response) => {
    // response.writeHead(200, headerText);
    let options = url.parse(request.url, true).query;
    // response.write(JSON.stringify(options));

    // Heroku mod start
    if (request.url.endsWith("/index.html")) {
        fs.readFile('index.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.write(data);
            }
            response.end();
        });
        return;
    } else if (request.url.endsWith("region.html")) {
        fs.readFile('region.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.write(data);
            }
            response.end();
        });
        return;
    } else if (request.url.endsWith("champion.html")) {
        fs.readFile('champion.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.write(data);
            }
            response.end();
        });
        return;
    } else if (request.url.endsWith("account.html")) {
        fs.readFile('account.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.write(data);
            }
            response.end();
        });
        return;
    } else if (request.url.endsWith("login.html")) {
        fs.readFile('login.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.write(data);
            }
            response.end();
        });
        return;
    } else if (request.url.endsWith("signup.html")) {
        fs.readFile('signup.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.write(data);
            }
            response.end();
        });
        return;
    } else if (request.url.endsWith("login.js")) {
        console.log("reached login.js");
        fs.readFile('login.js', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/javascript"
                });
                response.write(data);
            }
            response.end();
        });
        return;
    }
    else if (request.url.endsWith("login")) {
        console.log('request made');
        const value = { "success": true };
        console.log(value);
        console.log(value);
        response.write(JSON.stringify(value));
        response.end();
        return;
    }
    // Heroku mod ends

    // if (request.url.startsWith("/create")) {
    //     await createCounter(options.name, response);
    //     return;
    // }
});

server.listen(8080);
