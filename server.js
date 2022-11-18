// let http = require('http');
// let url = require('url');
// let fs = require('fs');


// let server = http.createServer();
// let signedIn = false;
// let regionInfo;
// server.on('request', async (request, response) => {
//     // response.writeHead(200, headerText);
//     let options = url.parse(request.url, true).query;
//     // response.write(JSON.stringify(options));

//     // Heroku mod start
//     if (request.url.endsWith("/index.html")) {
//         fs.readFile('index.html', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/html"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("region.html")) {
//         fs.readFile('region.html', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/html"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("champion.html")) {
//         fs.readFile('champion.html', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/html"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("account.html")) {
//         fs.readFile('account.html', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/html"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("login.html")) {
//         fs.readFile('login.html', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/html"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("signup.html")) {
//         fs.readFile('signup.html', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/html"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("login.js")) {
//         fs.readFile('login.js', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/javascript"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("main.js")) {
//         fs.readFile('main.js', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/javascript"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("signup.js")) {
//         fs.readFile('signup.js', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/javascript"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     } else if (request.url.endsWith("region.js")) {
//         fs.readFile('region.js', null, function (error, data) {
//             if (error) {
//                 response.writeHead(404);
//                 response.write('Whoops! File not found!');
//             } else {
//                 response.writeHead(200, {
//                     "Content-Type": "text/javascript"
//                 });
//                 response.write(data);
//             }
//             response.end();
//         });
//         return;
//     }
//     else if (request.url.endsWith("login")) {
//         signedIn = true;
//         const value = { "success": true };
//         response.write(JSON.stringify(value));
//         response.end();
//         return;
//     }
//     else if (request.url.endsWith("isSignedIn")) {
//         response.write(JSON.stringify({"signedIn": signedIn}));
//         response.end();
//         return;
//     }
//     else if (request.url.endsWith("goToRegion")) {
//         regionInfo = {name: "Demacia", img: "demacia-hallvalor.jpg"};
//         response.write(JSON.stringify({"signedIn": signedIn}));
//         response.end();
//         return;
//     }
//     else if (request.url.endsWith("regionInfo")) {
//         response.write(JSON.stringify(regionInfo));
//         response.end();
//         return;
//     }
//     // Heroku mod ends

//     // if (request.url.startsWith("/create")) {
//     //     await createCounter(options.name, response);
//     //     return;
//     // }
// });

// server.listen(process.env.PORT);

const express = require('express'); // express itself w/ CommonJS
const app = express(); // this is the "app"
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
let fs = require('fs');
const port = process.env.PORT;     // we will listen on this port

// const { Pool } = require('pg');
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });


// const { Client } = require('pg');

// const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

// client.connect();

app.use('/', urlencodedParser, express.static('.'));
app.get('/champion', (req, res) => {
    console.log('test');
    if (fs.existsSync('./data/champions.json')) {
        const championsJSON = fs.readFileSync('./data/champions.json');
        const champions = JSON.parse(championsJSON);
        console.log(champions);
        const championsFiltered = champions.filter(x => x['name'].toLowerCase() === req.query['name'].toLowerCase());
        console.log('test');
        if (championsFiltered.length === 0) {
            res.send('404 error');
        }
        else {
            const champion = championsFiltered[0];
            let content = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>Lore King</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
                </head>

                <body>
                <div class="row">
                    <div class="col lg-2">
                        <div class="text-start">
                            <button type="submit" class="btn btn-primary">Back</button>
                        </div> 
                    </div>
                
               
                 
                    <div class="text-end col">
                        <button type="submit" class="btn btn-secondary">Signup/Login</button>
                        <img src="profPic.jpg" class="rounded" style="width: 100px;height: 100px">
                    </div>
                </div>
            
                <div class="display-1">
                    <div class="text-center">`;
            content += champion.name;
            content += `</div>
            </div>
            
                <div class="container">
                    
                    <div class="row">
                        <div class="text-right">
                            <img src=`;
            content += champion.image;
            content += ` class="img-thumbnail" style="width:960px;height:490px" id="championImage">
        </div>

        <div class="row">
            <div class="display-1">
            <a href=`
            content += champion.link;
            content += `>View official lore</a></div>
        </div>
        <div class="row">
            <div class="col-lg-2">
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
                        #General-Region
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">#Story-Specific</a>
                    <a href="#" class="list-group-item list-group-item-action">#Fan-Fic</a>
                </div>
        </div> 
        </div>
        <div class="row">
            <div class="col-lg-6">
                <input type="text" class="form-control" placeholder="Type your thoughts here!"
                    aria-label="Type your thoughts here!">
            </div>
        </div>

        <div class="col-12">
            <button class="btn btn-primary" type="submit">Submit Post</button>
            <button class="btn btn-secondary" type="submit">Reply</button>
        </div>


        <div class="row">
            <div class="text-right">

                <img src="67-676994_4-stars-four-out-of-five-stars.png" class="rounded"
                    style="width: 100px;height: 23px">
            </div>
        </div>

        <div class="text-start">

        </div>

    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
    integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
    crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"
    integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk"
    crossorigin="anonymous"></script>
</body>

</html>`;
            console.log(content);
            res.send(content);
        }
    }
    else {
        res.send([]);
    }
    res.end();
});

app.get('/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('CREATE TABLE test(id int, review varchar(1000));');
        const results = { 'results': (result) ? result.rows : null };
        res.render('pages/db', results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.listen(8000, () => { });