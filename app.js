const express = require("express");
const bcrypt = require("bcrypt");

const favicon = require("serve-favicon");

const app = express();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mixmeet",
});

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
app.use(express.urlencoded({ extended: false }));

app.use(favicon(__dirname + "/public/images/favicon.png"));
console.log(__dirname);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});
app.post("/sign-in", (req, res) => {
  //confirm that  theemail is registered
  //compare password provided with the hash  in db
  db.query(
    "SELECT email,password FROM USERS WHERE email = ?",
    [req.body.email],
    (err, result) => {
      //handle error
      if (result.length > 0) {
        //proceed
        bcrypt.compare(req.body.password, result[0].password, (err, match) => {
          if (match) {
            res.redirect("/");
          } else {
            res.render("sign-in", {
              error: true,
              errorMessage: "Incorrect password",
            });
          }
        });
      } else {
        res.render("sign-in", {
          error: true,
          errorMessage: "Email not registered",
        });
      }
    }
  );
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});
app.post("/sign-up", (req, res) => {
  //get data - body-passer
  //check if confirm password is same as password
  //check if email is already in use/existing
  // encrypt password/ create hash
  //store all details in database- insert statement
  console.log(req.body);
  if (req.body.password === req.body.confirm) {
    //proceed
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [req.body.email],
      (err, results) => {
        if (results.length > 0) {
          //email already in use
          res.render("sign-up", {
            error: true,
            errorMessage: "Email already in use.use another or login",
          });
        } else {
          //proceed
          bcrypt.hash(req.body.password, 4, function (err, hash) {
            //we have access to hashed password
            db.query(
              "INSERT INTO users(username, email, password, img_link, bio) values(?,?,?,?,?) ",
              [
                req.body.username,
                req.body.email,
                hash,
                "image.png",
                req.body.bio,
              ],
              (error) => {
                //end
                if (error) {
                  res.render("sign-up", {
                    error: true,
                    errorMessage: "Something went wrong",
                  });
                } else {
                  res.redirect("/sign-in");
                }
              }
            );
          });
        }
      }
    );

    //successfull signup
  } else {
    res.render("sign-up", {
      error: true,
      errorMessage: "Passwords do not match",
    });
  }
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
