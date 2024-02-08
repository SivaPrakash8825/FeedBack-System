const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
const port = process.env.PORT || 3010;
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

// app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.JWT_SECRETKEY + "", // Change this to a random string
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: false, sameSite: "strict" }, // Set secure to true if using HTTPS
  })
);

// get question data
app.get("/getQuestions", (req, res) => {
  try {
    db.query("SELECT * FROM questions", (err, ress) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.send(ress);
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// set question data
app.post("/setQuestions", async (req, res) => {
  const data = req.body.data;
  try {
    // console.log(data);
    db.query(
      "CREATE TABLE IF NOT EXISTS `feedback`.`questions` (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`question` TEXT NULL,type TEXT);",
      async (err, ress) => {
        if (!err) {
          // console.log("no err");
          // Add Questions to table
          // db.query("DELETE FROM questions");
          const values = data
            .map(
              ({ id, type, question }) =>
                `(${id},'${type}','${JSON.stringify(question)}')`
            )
            .join(",");
          const query = `REPLACE INTO questions (id,type, question) VALUES ${values}`;

          db.query(query, (error, results) => {
            if (error) {
              return res.status(400).send(error.message);
            } else {
              return res.status(200).send("Questions Inserted :)");
            }
          });
        }
      }
    );
  } catch (error) {
    // console.log("yeah");
    console.log(error.message);
    return res.status(400).send(error.message);
  }
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("DB connected");
  }
});

//api data format

// {
//   "count":20,
//   "validfrom":"02-12-23",
//   "validto":"04-12-23",
//   "dept":"AD",
//   "degree":"UG",
//   "sem":2,
//   "section":"C",
//   "assessmenttype":"mgmt-pre",
//   "academicyear":"2023-2024",
//   "password":"Kcet@"
// }

// generate login username password
app.post("/generateLogin", (req, res) => {
  const {
    count,
    validfrom,
    validto,
    dept,

    degree,
    sem,
    section,
    assessmenttype,
    academicyear,
    password,
  } = req.body;
  if (password == "Kcet@") {
    const options = {
      a: 1,
      b: 2,
      c: 3,
      pre: 1,
      post: 2,
      "mgmt-pre": 3,
      "mgmt-final": 4,
      other: 5,
    };

    let parameters = [];
    let placeholder = [];
    let academicyr = academicyear.substring(2, 4);
    let ExcelData = [];
    let degreetype = degree.charAt(0);

    let sec = options[`${section.toLowerCase()}`];
    let assessment = options[`${assessmenttype.toLowerCase()}`];
    const array = [
      "AA",
      "CS",
      "EE",
      "EI",
      "CI",
      "BT",
      "IT",
      "ME",
      "MT",
      "EC",
      "PT",
      "PS",
      "MB",
    ];
    const key = array.indexOf(dept);
    let skey = key + 15;

    for (let i = 0; i < count; i++) {
      let number = assessment * 100 + i;
      let pn = (number * 42) % 1000;
      if (pn < 100) {
        pn *= 10;
      }
      const username = `${dept}${sec}${sem.toString()}${academicyr}${degreetype}${number}`;
      const password = `${dept}@${skey}${pn.toString(8)}${pn.toString(16)}${
        key < 0 ? -1 * key : key
      }${sec}`;
      ExcelData = [
        ...ExcelData,
        {
          id: i + 1,
          validfrom: validfrom,
          validto: validto,
          dept: dept,
          sem: sem,
          section: section,
          username: username,
          password: password,
        },
      ];
      parameters = [
        ...parameters,
        i + 1,

        validfrom,
        validto,
        dept,
        sem,
        section,
        username,
        password,
      ];
      placeholder = [...placeholder, "(?,?,?,?,?,?,?,?)"];
    }

    db.query(
      `replace into feedbacklogin(id,validfrom,validto,dept,sem,section,username,password) values${placeholder}`,
      parameters,
      (error, result) => {
        if (result) {
          res.status(200).send(ExcelData);
        } else {
          console.log(error);
          res.status(400).send({ msg: "error" });
        }
      }
    );
  } else {
    res.status(200).send({ msg: "invalid password" });
  }
});

// check login auth admin
app.post("/loginAuth", (req, res) => {
  try {
    const { username, password } = req.body;
    db.query(
      "SELECT * FROM masterLogin WHERE username = ? and password = ?",
      [username, password],
      (err, result) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (result[0]) {
          const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRETKEY + ""
          );
          req.session.user = token;
          return res.status(200).send("admin");
        } else {
          db.query(
            "SELECT * FROM feedbackLogin WHERE username = ? and password = ?",
            [username, password],
            (err, result) => {
              if (err) {
                return res.status(400).send(err.message);
              }
              if (result[0]) {
                const token = jwt.sign(
                  { role: "user" },
                  process.env.JWT_SECRETKEY + ""
                );
                req.session.user = token;
                return res.status(200).send("user");
              } else {
                return res.status(200).send("Data Not Found!");
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/me", (req, res) => {
  try {
    if (req.session.user) {
      const verify = jwt.verify(
        req.session.user,
        process.env.JWT_SECRETKEY + ""
      );
      return res.status(200).send(verify.role);
    }
    return res.status(200).send("no session");
    // return;
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
