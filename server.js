const express = require('express'); // express itself w/ CommonJS
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const app = express(); // this is the "app"
//const bodyParser = require('body-parser');
const path = require('path');
//const urlencodedParser = bodyParser.urlencoded({ extended: false });
const cors = require('cors');
app.use(cors());
let fs = require('fs');
const LocalStrategy = require('passport-local').Strategy;
const port = process.env.PORT;     // we will listen on this port

const minicrypt = require('./miniCrypt');
const mc = new minicrypt();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    const queryResult = await client.query(`SELECT * FROM reviews WHERE lore = '${name}' ORDER BY time_posted DESC;`);
    for (let row of queryResult.rows) {
        discussion += `<div class="container">
                            <div class="fs-5">By ${row.username}</div>
                            <div class="fs-3">${row.review}</div>
                        </div>`;
    }
    client.end();
    return discussion;
}

async function userReviews(userID) {
    reviews = ``;
    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.connect();
    const queryResult = await client.query(`SELECT * FROM reviews WHERE username = '${userID}' ORDER BY time_posted DESC;`);
    for (let row of queryResult.rows) {
        reviews += `<div class="container">
                            <div class="fs-5">In ${row.lore}</div>
                            <div class="fs-3">${row.review}</div>
                        </div>`;
    }
    client.end();
    return reviews;
}

async function userFavorites(userID) {
    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.connect();
    const queryResult = await client.query(`SELECT champion, region, position, story, rank FROM users WHERE username = '${userID}';`);
    for (let row of queryResult.rows) {
        const favChampion = row['champion'];
        const favRegion = row['region'];
        const favPosition = row['position'];
        const favStory = row['story'];
        const rank = row['rank'];
        return `<div class="p-3 bg-opacity-10 border border-grey border-start-0 rounded-end">
    <p>Favorite champion: ${favChampion}</p>
    <p>Favorite region: ${favRegion}</p>
    <p>Favorite position: ${favPosition}</p>
    <p>Favorite story: ${favStory}</p>
    <p>Current rank: ${rank}</p></div>`;
    }
}

const session = {
    secret: process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave: false,
    saveUninitialized: false
};
const strategy = new LocalStrategy(
    async (username, password, done) => {
        if (!findUser(username)) {
            // no such user
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong username' });
        }
        if (!validatePassword(username, password)) {
            // invalid password
            // should disable logins after N messages
            // delay return to rate-limit brute-force attacks
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong password' });
        }
        // success!
        // should create a user object here, associated with a unique identifier
        return done(null, username);
    });

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

let users = {}
async function getUsers() {
    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    client.connect();
    const queryResult = await client.query(`SELECT * FROM users;`);
    let ret = {};
    for (let row of queryResult.rows) {
        ret[row.username] = [row.salt, row.password, row.champion, row.region, row.position, row.story, row.rank];
    }
    client.end();
    return ret;
}
// name : [salt, hash]'
(async () => {
    users = await getUsers()
})();

function findUser(username) {
    if (!users[username]) {
        return false;
    }
    else {
        return true;
    }
}

// Returns true iff the password is the one we have stored.
function validatePassword(name, pwd) {
    if (!findUser(name)) {
        return false;
    }
    if (mc.check(pwd, users[name][0], users[name][1])) {
        return true;
    }
    return false;
}

async function addUser(name, pwd, champion, region, position, story, rank) {
    if (findUser(name)) {
        return false;
    }
    const [salt, hash] = mc.hash(pwd);
    users[name] = [salt, hash, champion, region, position, story, rank];
    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    client.connect();
    const queryResult = await client.query(`INSERT INTO users (username, password, salt, champion, region, position, story, rank) VALUES ('${name}','${hash}','${salt}','${champion}','${region}','${position}','${story}','${rank}')`);
    client.end();
    return true;
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

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/');
    }
}

app.use('/', express.static('.'));

app.get('/',
    checkLoggedIn,
    (req, res) => {
        res.send("hello world");
    });

app.post('/login',
    passport.authenticate('local', {
        'successRedirect': '/user', // when we login, go to /private 
        'failureRedirect': '/signup'      // otherwise, back to login
    }));

app.get('/login',
    (req, res) => res.sendFile('/login.html',
        { 'root': "." }));

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    }); // Logs us out!
});

app.post('/signup', async (req, res) => {
    const username = req.body.user;
    const password = req.body.password;
    const champion = req.body.champion;
    const region = req.body.region;
    const position = req.body.position;
    const story = req.body.story;
    const rank = req.body.rank;
    const userAdded = await addUser(username, password, champion, region, position, story, rank);
    if (userAdded) {
        res.redirect('/login');
    }
    else {
        res.redirect('/signup');
    }
});

app.get('/signup', (req, res) => res.sendFile('/signup.html', { 'root': "." }));

// Private data
app.get('/user',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {             // Go to the user's page.
        res.redirect('/user/' + req.user);
    });

// A dummy page for the user.
app.get('/user/:userID/',
    checkLoggedIn, // We also protect this route: authenticated...
    async (req, res) => {
        // Verify this is the right user.
        if (req.params.userID === req.user) {
            let content = `
            <!DOCTYPE html>
<html lang="en">
    <head>
        <style>
            .btn-square-lg {
    	        width: 200px !important;
                height: 125px !important;
                text-align: center;
                padding: 0px;
                font-size:18px;
                margin-bottom:25px;
            }
        </style>
       
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Account</title>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
    </head>
    <body style="height:70vh;">
    <div>
        <div>
            <a class="btn" href="/">Return</a>
            <a class="btn float-end" href="/logout">Signout</a>
        </div>
    </div>
    
    <div class="display-1">
        <div class="text-center">
            ` + req.params.userID + `
        </div>
    </div>`;
            content += await userFavorites(req.params.userID);
            content += `<div>
        <div> 
            <h2>Recent Reviews</h2>
        </div>`;
            content += await userReviews(req.params.userID);
            content += `</div>
    
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js" integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk" crossorigin="anonymous"></script>
    </body>
</html>
            `;
            res.send(content);

        } else {
            res.redirect('/user/');
        }
    })

app.get('/champion.js', (req, res) => {
    res.send('./champion.js');
});

app.get('/main.js', (req, res) => {
    res.send('./main.js');
});

app.get('/getRegions', (req, res) => {
    const regionsJSON = fs.readFileSync('./data/regions.JSON');
    const regions = JSON.parse(regionsJSON);
    res.send(regions);
});

app.post('/addPost', async (req, res) => {
    const user = req.body.user;
    const lore = req.body.lore;
    const review = req.body.review;
    const likes = 0;
    const time_posted = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.connect();
    const queryResult = await client.query(`INSERT INTO reviews (username,lore,review,likes,time_posted) VALUES ('${user}','${lore}','${review}',${likes},'${time_posted}')`);
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
            const user = req.user;
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
                        <div class="text-end col">`;
            if (user === undefined) {
                content += `<button type="submit" class="btn btn-secondary" id="login-button">Signup/Login</button>`;
            }
            else {
                content += `<button type="submit" class="btn btn-secondary" id="account-button">${user}</button>`;
            }
            content += `</div>
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
                                    </div>
                                </div> 
                            </div>
                            <div class="row">
                                <div class="col-lg-6"  id="review">
                                    <input type="text" class="form-control" placeholder="Type your thoughts here!" aria-label="Type your thoughts here!" id="reviewBox">
                                </div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit" id="submitButton">Submit</button>
                                <!--<button class="btn btn-secondary" type="submit">Reply</button>-->
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
            const user = req.user;
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
                        <div class="text-end col">`;
            if (user === undefined) {
                content += `<button type="submit" class="btn btn-secondary" id="login-button">Signup/Login</button>`;
            }
            else {
                content += `<button type="submit" class="btn btn-secondary" id="account-button">${user}</button>`;
            }
            content += `</div>
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
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        ${dropDownChampions(region.name)}
                                    </div>
                                    <button class="btn btn-secondary dropdown" type="button" id="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        #General-Region
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        ${dropDownRegions()}
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class="row">
                            <div class="col-lg-6"  id="review">
                                <input type="text" class="form-control" placeholder="Type your thoughts here!" aria-label="Type your thoughts here!" id="reviewBox">
                            </div>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit" id="submitButton">Submit</button>
                            <!--<button class="btn btn-secondary" type="submit">Reply</button>-->
                        </div>
                        <div class="text-start"></div>
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
        res.send([]);
    }
    res.end();
});

app.get('/signedInUser', (req, res) => {
    res.json({ user: req.user });
});

app.listen(process.env.PORT, () => { });