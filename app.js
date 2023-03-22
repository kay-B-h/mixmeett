const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");

const app = express();

require("./services/main");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: true,
  })
);

//method chaining
const db = require("mysql").createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mixmeet",
});
//multer js code
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/images/profiles");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// momment js , Intl formatting--
app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home", { user: req.session.user });
  } else {
    res.render("index");
  }
});

app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

app.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.post("/sign-in", (req, res) => {
  // confirm that email is registered
  // compare password provided with the hash in db
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    (error, results) => {
      // handle error
      if (results.length > 0) {
        //proceed
        bcrypt.compare(req.body.password, results[0].password, (err, match) => {
          if (match) {
            // create session
            // console.log(results)
            req.session.user = results[0];
            // console.log(req.sessionID)
            res.redirect("/");
          } else {
            res.render("sign-in", {
              error: true,
              errorMessage: "Incorrect Password",
            });
          }
        });
      } else {
        res.render("sign-in", {
          error: true,
          errorMessage: "Email not registered.",
        });
      }
    }
  );
});

// reset password using OTP- emails,text messages
// postman

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.get("/all-users", (req, res) => {
  if (req.session.user) {
    db.query("SELECT * FROM users", (err, result) => {
      res.json(result);
    });
  } else {
    res.json({ error: "Log in" });
  }
});

app.post("/sign-up", upload.single("image"), (req, res) => {
  // get data - body-parser **
  // check if confirm pass & password match **
  // check if email is already used/ existing **
  // encrypt password / create a hash **
  // store all details in db - insert statement
  // console.log(req.body)
  // console.log(req.file)
  let fileType = req.file.mimetype.slice(req.file.mimetype.indexOf("/") + 1);
  if (req.body.password === req.body.confirm) {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [req.body.email],
      (err, results) => {
        if (results.length > 0) {
          // email exist in db
          res.render("sign-up", {
            error: true,
            errorMessage: "Email already exists. Use another or login",
          });
        } else {
          bcrypt.hash(req.body.password, 4, function (err, hash) {
            // we have access to the hashed pass as hash
            db.query(
              "INSERT INTO users(username,email,password,image_link,image_type,bio) values(?,?,?,?,?,?)",
              [
                req.body.username,
                req.body.email,
                hash,
                req.file.filename,
                fileType,
                req.body.bio,
              ],
              (error) => {
                if (error) {
                  res.render("sign-up", {
                    error: true,
                    errorMessage:
                      "Contact Admin, and tell them something very terrible is going on in the server",
                  });
                } else {
                  res.redirect("/sign-in"); // sucessful signup
                }
              }
            );
          });
        }
      }
    );
  } else {
    res.render("sign-up", {
      error: true,
      errorMessage: "Password and confirm Password do not match",
    });
  }
});
app.listen(3001, () => {
  console.log("app running!!...");
});
// const express = require("express");
// const bcrypt = require("bcrypt");
// const session = require("express-session");

// const favicon = require("serve-favicon");
// //method chaining
// const app = express();
// const mysql = require("mysql");
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "mixmeet",
// });
// app.get("/", (req, res) => {
//   if (req.session) {
//     res.render("home", { user:req.session.user });
//   } else {
//     res.render("index");
//   }
// });
// app.get("/sign-in", (req, res) => {
//   res.render("sign-in");
// });
// app.get("/sign-up", (req, res) => {
//   req.session.destroy(() => {
//     res.redirect("/");
//   });
// });

// // db.connect((err) => {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     console.log("db connected successfully(main)");
// //   }
// // });
// require("./services/main");

// app.set("view engine", "ejs");
// app.use(express.static("public"));
// app.use(express.urlencoded({ extended: false }));
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(favicon(__dirname + "/public/images/favicon.png"));
// console.log(__dirname);

// app.get("/", (req, res) => {
//   res.render("index");
// });
// app.get("/sign-in", (req, res) => {
//   res.render("sign-in");
// });
// app.post("/sign-in", (req, res) => {
//   //confirm that  theemail is registered
//   //compare password provided with the hash  in db
//   db.query(
//     "SELECT * FROM USERS WHERE email = ?",
//     [req.body.email],
//     (err, result) => {
//       //handle error
//       if (result.length > 0) {
//         //proceed
//         bcrypt.compare(req.body.password, result[0].password, (err, match) => {
//           if (match) {
//             //create session
//             req.session.user = result[0];
//             console.log(req.sessionID);
//             res.redirect("/");
//           } else {
//             res.render("sign-in", {
//               error: true,
//               errorMessage: "Incorrect password",
//             });
//           }
//         });
//       } else {
//         res.render("sign-in", {
//           error: true,
//           errorMessage: "Email not registered",
//         });
//       }
//     }
//   );
// });

// app.get("/sign-up", (req, res) => {
//   res.render("sign-up");
// });

// app.post("/sign-up", (req, res) => {
//   //get data - body-passer
//   //check if confirm password is same as password
//   //check if email is already in use/existing
//   // encrypt password/ create hash
//   //store all details in database- insert statement
//   console.log(req.body);
//   if (req.body.password === req.body.confirm) {
//     //proceed
//     db.query(
//       "SELECT email FROM users WHERE email = ?",
//       [req.body.email],
//       (err, results) => {
//         if (results.length > 0) {
//           //email already in use
//           res.render("sign-up", {
//             error: true,
//             errorMessage: "Email already in use.use another or login",
//           });
//         } else {
//           //proceed
//           bcrypt.hash(req.body.password, 4, function (err, hash) {
//             //we have access to hashed password
//             db.query(
//               "INSERT INTO users(username, email, password, img_link, bio) values(?,?,?,?,?) ",
//               [
//                 req.body.username,
//                 req.body.email,
//                 hash,
//                 "image.png",
//                 req.body.bio,
//               ],
//               (error) => {
//                 //end
//                 if (error) {
//                   res.render("sign-up", {
//                     error: true,
//                     errorMessage: "Something went wrong",
//                   });
//                 } else {
//                   res.redirect("/sign-in");
//                 }
//               }
//             );
//           });
//         }
//       }
//     );

//     //successfull signup
//   } else {
//     res.render("sign-up", {
//       error: true,
//       errorMessage: "Passwords do not match",
//     });
//   }
// });
// app.listen(3001, () => {
//   console.log("app running!!!");
// });

// db.query(
//   "CREATE TABLE IF NOT EXISTS users(user_id INT NOT NULL AUTO_INCREMENT,username VARCHAR(200),email VARCHAR(200),password VARCHAR(200), img_link VARCHAR(255) DEFAULT NULL,image_type VARCHAR(10) bio VARCHAR(255), PRIMARY KEY(user_id))"
// );

// db.query(
//   " CREATE TABLE  IF NOT EXISTS posts(post_id INT NOT NULL AUTO_INCREMENT,post_massage VARCHAR(255), post_image_link VARCHAR(255) DEFAULT NULL, PRIMARY KEY(post_id))"
// );
// db.query(
//   "CREATE TABLE IF NOT EXISTS comments(comment_id INT NOT NULL AUTO_INCREMENT,comment_massage VARCHAR(255),comment_imahge_link VARCHAR(255) DEFAULT NULL,PRIMARY KEY(comment_id))"
// );

//create a db called mixmmet
//have a table called users
