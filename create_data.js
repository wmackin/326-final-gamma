const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();


// client.query('CREATE TABLE test(id int, review varchar(1000));', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

// client.query("INSERT INTO test (id, review) VALUES (2, 'world');", (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

// client.query('SELECT * FROM test;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

client.query("CREATE TABLE reviews ( username varchar(50), lore varchar(100), review varchar(1000), likes int, time_posted timestamp );", (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    console.log("good");
    client.end();
});

// client.query("CREATE TABLE users ( username varchar(50) PRIMARY KEY, password varchar(100) );", (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//         console.log(JSON.stringify(row));
//     }
//     client.end();
// });


// const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
// console.log(time);
// client.query(`INSERT INTO reviews (username, lore, review, time_posted, likes) VALUES ('x', 'name2', 'Very very excellent!','${time}',0);` , (err, res) => {
//   if (err) throw err;
   
//  });

client.query('SELECT * FROM users;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});