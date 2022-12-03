const express = require('express'); // express itself w/ CommonJS
const app = express(); // this is the "app"
//const bodyParser = require('body-parser');
const path = require('path');
//const urlencodedParser = bodyParser.urlencoded({ extended: false });
const cors = require('cors');
app.use(cors());
let fs = require('fs');
const port = process.env.PORT;     // we will listen on this port
// const { Client } = require('pg');
// const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

// client.connect();

app.use(express.urlencoded({extended:false}));
async function generateDiscussion(name) {
    discussion = ``;
    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.connect();
    const queryResult = await client.query(`SELECT * FROM reviews WHERE lore = '${name}';`);
    for (let row of queryResult.rows) {
        discussion += `<div class="container">
                            <div class="fs-5">By ${row.username}</div>
                            <div class="fs-3">${row.review}</div>
                        </div>`;
    }
    client.end();
    return discussion;
}


function dropDownChampions(region) {
    let options = ``;
    if (fs.existsSync('./data/champions.JSON')) {
        const championsJSON = fs.readFileSync('./data/champions.JSON');
        let champions = JSON.parse(championsJSON);
        champions = champions.filter(x => x['region'].toLowerCase() === region.toLowerCase());
        for (let i = 0; i < champions.length; i++) {
            options += `<a class="dropdown-item" href="/champion?name=${champions[i].name}"> ${champions[i].name} </a>`;
        }
    }
    return options;
}

function dropDownRegions() {
    let options = ``;
    if (fs.existsSync('./data/regions.JSON')) {
        const regionsJSON = fs.readFileSync('./data/regions.JSON');
        let regions = JSON.parse(regionsJSON);
        for (let i = 0; i < regions.length; i++) {
            options += `<a class="dropdown-item" href="/region?name=${regions[i].name}"> ${regions[i].name} </a>`;
        }
    }
    return options;
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/', express.static('.'));

app.get('/champion.js', (req, res) => {
    res.send('./champion.js');
});

app.get('/main.js', (req, res) => {
    res.send('./main.js');
});

// app.get('/data/regions.json', (req, res) => {
//     res.send('./data/regions.json');
// });

app.get('/getRegions', (req, res) => {
    console.log('found regions')
    const regionsJSON = fs.readFileSync('./data/regions.JSON');
    const regions = JSON.parse(regionsJSON);
    res.send(regions);
});
app.use(express.json());
app.post('/addPost', async (req, res) => {
    console.log("You are in post");
    console.log(req.body);
    const user = req.body.user;
    const lore = req.body.lore;
    const review = req.body.review;
    const likes = 0;
    const time_posted = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const { Client } = require('pg');
    console.log(process.env.DATABASE_URL)
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.connect();
    const queryResult = await client.query(`INSERT INTO reviews (username,lore,review,likes,time_posted) VALUES ('Josh','Graves','Thanks',0,'2022-12-03 19:33:20.663513')`);
    console.log(queryResult);
    client.end();
    res.send(req.body);
})

app.get('/champion', async (req, res) => {
    if (fs.existsSync('./data/champions.JSON')) {
        const championsJSON = fs.readFileSync('./data/champions.JSON');
        const champions = JSON.parse(championsJSON);
        const championsFiltered = champions.filter(x => x['name'].toLowerCase() === req.query['name'].toLowerCase());
        if (championsFiltered.length === 0) {
            res.send('404 error');
            return;
        }
        else {
            const champion = championsFiltered[0];
            const discussion = await generateDiscussion(champion.name);
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
                                <a class="btn btn-primary" href="/" role="button">Home</a>
                            </div> 
                        </div>
                        <div class="text-end col">
                            <button type="submit" class="btn btn-secondary">Signup/Login</button>
                            <img src="profPic.jpg" class="rounded" style="width: 100px;height: 100px">
                        </div>
                    </div>
                    <div class="display-1">
                        <div class="text-center" id="name">${champion.name}</div>
                        <div class="container">
                            <div class="row">
                                <div class="text-right">
                                    <img src=images/championImages/${champion.image} class="img-thumbnail" style="width:960px;height:490px" id="championImage">
                                </div>
                            <div class="row">
                                <div class="fs-3">
                                    <a href=${champion.link}>View official lore</a>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-2">
                                    <div class="btn-group active">
                                        <button class="btn btn-secondary dropdown" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            #Champion-Specific
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            ${dropDownChampions(champion.region)}
                                        </div>
                                        <button class="btn btn-secondary dropdown" type="button" id="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            #General-Region
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            ${dropDownRegions()}
                                        </div>
                                        <button class="btn btn-secondary" type="button" id="button" aria-expanded="false">
                                            #Fan-Fic
                                        <button class="btn btn-secondary" type="button" id="button" aria-expanded="false">
                                            #Story-Specific
                                        </button>
                                    </div>
                                </div> 
                            </div>
                            <div class="row">
                                <div class="col-lg-6"  id="review">
                                    <input type="text" class="form-control" placeholder="Type your thoughts here!" aria-label="Type your thoughts here!" id="reviewBox">
                                </div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit" id="sumbitButton">Submit</button>
                                <!--<button class="btn btn-secondary" type="submit">Reply</button>-->
                            </div>
                            <div class="row">
                                <div class="text-right">
                                    <img src="67-676994_4-stars-four-out-of-five-stars.png" class="rounded" style="width: 100px;height: 23px">
                                </div>
                            </div>
                            <div class="text-start"></div>
                        </div>
                        <div class="fs-2">Discussion</div>
                        ${discussion}
                    </div>
                    <script src="./champion.js"></script>
                </body>
            </html>`;
            res.send(content);
        }
    }
    else {
        res.send("No JSON");
    }
    res.end();
});

app.get('/region', async (req, res) => {
    if (fs.existsSync('./data/regions.JSON')) {
        const regionsJSON = fs.readFileSync('./data/regions.JSON');
        const regions = JSON.parse(regionsJSON);
        const regionsFiltered = regions.filter(x => x['name'].toLowerCase() === req.query['name'].toLowerCase());
        if (regionsFiltered.length === 0) {
            res.send('404 error');
        }
        else {
            const region = regionsFiltered[0];
            const discussion = await generateDiscussion(region.name);
            let content =
                `<!DOCTYPE html>
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
                                <a class="btn btn-primary" href="/" role="button">Home</a>
                            </div> 
                        </div>
                        <div class="text-end col">
                            <button type="submit" class="btn btn-secondary">Signup/Login</button>
                            <img src="profPic.jpg" class="rounded" style="width: 100px;height: 100px">
                        </div>
                    </div>
                    <div class="display-1">
                        <div class="text-center" id="name">${region.name}</div>
                    </div>
                    <div class="container">          
                        <div class="row">
                            <div class="text-right">
                                <img src=/images/${region.image} class="img-thumbnail" style="width:960px;height:490px" id="regionImage">
                            </div>
                        </div>
                        <div class="row">
                            <div class="display-1">
                                <a href= ${region.link}>View official lore</a>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-2">
                                <div class="btn-group active">
                                    <button class="btn btn-secondary dropdown" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        #Champion-Specific
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"
                                        ${dropDownChampions(region.name)}
                                    </div>
                                    <button class="btn btn-secondary dropdown" type="button" id="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        #General-Region
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        ${dropDownRegions()}
                                    </div>
                                    <button class="btn btn-secondary" type="button" id="button" aria-expanded="false">
                                        #Fan-Fic
                                    <button class="btn btn-secondary" type="button" id="button" aria-expanded="false">
                                        #Story-Specific
                                    </button>
                                </div>
                            </div> 
                        </div>
                        <div class="row">
                            <div class="col-lg-6"  id="review">
                                <input type="text" class="form-control" placeholder="Type your thoughts here!" aria-label="Type your thoughts here!" id="reviewBox">
                            </div>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit" id="sumbitButton">Submit</button>
                            <!--<button class="btn btn-secondary" type="submit">Reply</button>-->
                        </div>
                        <div class="row">
                            <div class="text-right">
                                <img src="67-676994_4-stars-four-out-of-five-stars.png" class="rounded" style="width: 100px;height: 23px">
                            </div>
                        </div>
                        <div class="text-start"></div>
                        <div class="fs-2">Discussion</div>
                        ${discussion}
                    </div>
                    <script src="./champion.js"></script>
                </body>
            </html>`;
            //                         <div class="text-right">
            //                             <img src="images/championImages/`;
            //             content += champion.image;
            //             content += `" class="img-thumbnail" style="width:960px;height:490px" id="championImage">
            //         </div>

            //         <div class="row">
            //             <div class="fs-3">
            //             <a href=`
            //             content += champion.link;
            //             content += `>View official lore</a></div>
            //         </div>
            //         <div class="row">
            //             <div class="col-lg-2">
            //                 <div class="list-group">
            //                     <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
            //                         #General-Region
            //                     </a>
            //                     <a href="#" class="list-group-item list-group-item-action">#Story-Specific</a>
            //                     <a href="#" class="list-group-item list-group-item-action">#Fan-Fic</a>
            //                 </div>
            //         </div> 
            //         </div>
            //         <div class="row">
            //             <div class="col-lg-6">
            //                 <input type="text" class="form-control" placeholder="Type your thoughts here!"
            //                     aria-label="Type your thoughts here!" id="reviewBox">
            //             </div>
            //         </div>

            //         <div class="col-12">
            //             <button class="btn btn-primary" type="submit" id='submitPost'>Submit Post</button>
            //             <!--<button class="btn btn-secondary" type="submit">Reply</button>-->
            //         </div>


            //         <div class="row">
            //             <div class="text-right">

            //                 <img src="67-676994_4-stars-four-out-of-five-stars.png" class="rounded"
            //                     style="width: 100px;height: 23px">
            //             </div>
            //         </div>

            //         <div class="text-start">

            //         </div>



            // </div>
            // <div class="fs-2">Discussion</div>`;
            //             const client = new Client({
            //                 user: 'postgres',
            //                 host: 'localhost',
            //                 database: 'gamma_user_info',
            //                 password: '1234abcd',
            //                 port: 5432,
            //             });
            //             client.connect();
            //             const queryResult = await client.query(`SELECT * FROM reviews WHERE lore = '${champion.name}';`);
            //             // content += await client.query(`SELECT * FROM reviews WHERE lore = '${champion.name}';`, async (err, result) => {
            //             //     let queryContent = "";
            //             // if (err) throw err;
            //             for (let row of queryResult.rows) {
            //                 content += '<div class="container"><div class="fs-5">By ';
            //                 content += row.username;
            //                 content += '</div><div class="fs-3">';
            //                 content += row.review;
            //                 content += '</div></div>';
            //             }
            //             content += `</div>

            //     <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
            //         integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
            //         crossorigin="anonymous"></script>
            //     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"
            //         integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk"
            //         crossorigin="anonymous"></script>
            //         <script src="champion.js"></script>
            //     </body>

            //     </html>`;
            res.send(content);
        }
    }
    else {
        res.send([]);
    }
    res.end();
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/signup.html'));
});

app.listen(process.env.PORT, () => { });