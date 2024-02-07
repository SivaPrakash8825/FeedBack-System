const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const db = require("./db");
const port = process.env.PORT || 3010;

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

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
//   "dept":"AD",
//   "degree":"UG",
//   "sem":2,
//   "section":"C",
//   "assessmenttype":"mgmt-pre",
//   "academicyear":"2023-2024",
//   "password":"Kcet@"
// }
app.post("/generateLogin", (req, res) => {
  const {
    count,
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

      parameters = [...parameters, dept, sem, section, username, password];
      placeholder = [...placeholder, "(?,?,?,?,?)"];
    }

    db.query(
      `replace into feedbacklogin(dept,sem,section,username,password) values${placeholder}`,
      parameters,
      (error, result) => {
        if (result) {
          res.status(200).send({ msg: "inserted" });
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

app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
