const express = require("express");
// const mysql = require("mysql");
//require("./")
const favicon = require("serve-favicon");

const app = express();
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "mixmeet",
// });

// db.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("db connected successfully(main)");
//   }
// });
require("./services/main");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/images/favicon.png"));
console.log(__dirname);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});
app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.listen(3001, () => {
  console.log("app running!!!");
});

// db.query(
//   "CREATE TABLE IF NOT EXISTS users(user_id INT NOT NULL AUTO_INCREMENT,username VARCHAR(200),email VARCHAR(200),password VARCHAR(200), img_link VARCHAR(255) DEFAULT NULL, bio VARCHAR(255), PRIMARY KEY(user_id))"
// );

// db.query(
//   " CREATE TABLE  IF NOT EXISTS posts(post_id INT NOT NULL AUTO_INCREMENT,post_massage VARCHAR(255), post_image_link VARCHAR(255) DEFAULT NULL, PRIMARY KEY(post_id))"
// );
// db.query(
//   "CREATE TABLE IF NOT EXISTS comments(comment_id INT NOT NULL AUTO_INCREMENT,comment_massage VARCHAR(255),comment_imahge_link VARCHAR(255) DEFAULT NULL,PRIMARY KEY(comment_id))"
// );

//create a db called mixmmet
//have a table called users
