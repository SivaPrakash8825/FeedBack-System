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
    cookie: { secure: false }, // Disable cookies
    maxAge: 30 * 60 * 1000, // Session expires after 30 minutes of inactivity
  })
);

// extract user detials by username
const FindUserDetails = (username) => {
  const assessmenttype = {
    1: "PRE",
    2: "POST",
    3: "mgmt-pre",
    4: "mgmt-final",
    5: "other",
  };
  const section = {
    1: "A",
    2: "B",
    3: "C",
  };
  const degree = {
    U: "UG",
    P: "PG",
  };
  const year = parseInt(username.substring(4, 6));

  return {
    section: section[username.charAt(2)],
    dept: username.substring(0, 2),
    sem: parseInt(username.charAt(3)),
    academicyear: `20${year}-${year + 1}`,
    degreetype: degree[username.at(6)],
    assessmenttype: assessmenttype[username.at(7)],
  };
};

// get question data
app.get("/getQuestions/:type", (req, res) => {
  const { type } = req.params;
  try {
    db.query(`SELECT * FROM questions WHERE type=?`, [type], (err, ress) => {
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
      "AD",
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
      `REPLACE INTO feedbacklogin(id,validfrom,validto,dept,sem,section,username,password) VALUES${placeholder}`,
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

// check login auth user and set session in server side
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
            { role: "admin", username: username },
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
                  { role: "user", username: username },
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

// get session data and valid user checker
app.get("/me", (req, res) => {
  try {
    if (req.session.user) {
      const verify = jwt.verify(
        req.session.user,
        process.env.JWT_SECRETKEY + ""
      );
      return res.status(200).send(verify);
    }
    return res.status(200).send("no session");
    // return;
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// store user feedback answer
app.post("/storeanswer", (req, res) => {
  const { username, marks, coursecode, type, comments } = req.body;
  console.log(type);
  const detials = FindUserDetails(username);
  try {
    db.query(
      `REPLACE INTO ${type}(username,coursecode,academicyear,section,dept,sem,assessmenttype,degreetype,marks,comments) VALUES(?,?,?,?,?,?,?,?,?,?)`,
      [
        username,
        coursecode,
        detials.academicyear,
        detials.section,
        detials.dept,
        detials.sem,
        detials.assessmenttype,
        detials.degreetype,
        marks,
        comments,
      ],
      (error, result) => {
        if (error) console.log(error);
        if (result) {
          res.status(200).send({ msg: "submitted" });
        }
        // console.log(error);
      }
    );
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

app.post("/generateReport", (req, res) => {
  const {
    dept,
    degree,
    sem,
    section,
    assessmenttype,
    coursecode,
    academicyear,
    password,
    subtype,
  } = req.body;
  // console.log(subcode);
  if (password == "Kcet@") {
    db.query(
      `SELECT * FROM  ${subtype} WHERE academicyear=? AND section=? AND dept=? AND sem=? AND assessmenttype=? AND degreetype=? AND coursecode=?;`,
      [academicyear, section, dept, sem, assessmenttype, degree, coursecode],
      (error, result) => {
        if (result) {
          console.log(result);
          res.status(200).send(result);
        } else {
          res.status(400).send({ msg: "error" });
        }
      }
    );
  } else {
    res.status(200).send({
      msg: "invalid password",
    });
  }
});

// generate subject wise report

app.post("/generateReportSubject", (req, res) => {
  const {
    dept,
    degree,
    sem,
    section,
    assessmenttype,
    academicyear,
    password,
    subcode,
    type,
  } = req.body;
  const acyr = academicyear.slice(0, 5) + academicyear.slice(-2);
  console.log(
    dept,
    degree,
    sem,
    section,
    assessmenttype,
    acyr,
    password,
    subcode,
    type
  );
  if (password == "Kcet@") {
    db.query(
      "SELECT a.`Sub Code`, a.`Sub Name`, a.Staff, c.dept, GROUP_CONCAT(c.marks SEPARATOR '-') AS subject_marks FROM mastertable a JOIN theory c ON a.`Sub Code` = c.coursecode AND c.academicyear = a.`Academic yr` WHERE a.`Sub Code` IN (SELECT coursecode FROM theory WHERE academicyear = ? AND dept = ? AND degreetype = ? AND sem = ? AND section = ? AND assessmenttype = ?) GROUP BY a.`Sub Code`, a.`Sub Name`, a.Staff, c.dept;",
      [acyr, dept, degree, sem, section, assessmenttype],
      (error, result) => {
        if (result) {
          // const averages = result.map((r, i) => {
          //   const { answers: a } = JSON.parse(r.marks);
          //   const sum = a.reduce((acc, val) => acc + val, 0);
          //   const outOf = 50;
          //   const avg = sum / a.length;
          //   return (avg / 5) * 50;
          //   // return a;
          // });
          // console.log(result);
          res.status(200).send(result);
        } else {
          res.status(400).send({ msg: error });
        }
      }
    );
  } else {
    res.status(200).send({
      msg: "invalid password",
    });
  }
});

// logout and destroy the session
app.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(200).send(err.message);
    });
    return res.status(200).send("Logout Done");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.post("/getCourses", (req, res) => {
  try {
    const { username } = req.body;
    const sectionOptions = {
      1: "A",
      2: "B",
      3: "C",
    };
    const assessmentTypeOptions = {
      1: "pre",
      2: "post",
      3: "mgmt-pre",
      4: "mgmt-final",
      5: "other",
    };
    const semToYearOptions = {
      1: "I",
      2: "I",
      3: "II",
      4: "II",
      5: "III",
      6: "III",
      7: "IV",
      8: "IV",
    };

    const dept = username.substring(0, 2);

    const section = sectionOptions[parseInt(username.charAt(2))];
    const sem = parseInt(username.charAt(3));
    const year = semToYearOptions[sem];
    // doubt !!!
    const academicyr = `20${username.substring(4, 6)}-${
      parseInt(username.substring(4, 6)) + 1
    }`;
    const degree = username.charAt(6) === "U" ? "UG" : "PG";
    // const count = parseInt(username.substring(7));

    // should change !!!
    const assessmenttype = section === "C" ? "mgmt-pre" : "mgmt-final";
    console.log(academicyr, dept, degree, sem, section, year);

    db.query(
      "SELECT * FROM mastertable WHERE `Academic yr` = ? and Dept = ? and `UG/PG` = ? and Semester = ? and Section = ? and `Sub Code` not in (select coursecode from theory  where username=?) and `Sub Code` not in (select coursecode from lab  where username=?);",
      [academicyr, dept, degree, sem, section, username, username],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send(err.message);
        }
        if (result.length != 0) {
          // console.log(result);
          return res.status(200).send({
            courses: result,
            academicyr,
            dept,
            degree,
            sem,
            section,
            year,
            username,
          });
        } else {
          console.log("Data Not Found!");
          return res.status(200).send("Data Not Found!");
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(200).send(error.message);
  }
});

app.post("/getcoursecode", (req, res) => {
  const { dept, degree, sem, section, academicyear } = req.body;

  try {
    db.query(
      `SELECT \`Sub Code\` FROM  mastertable WHERE \`Academic yr\`=? AND Section=? AND Dept=? AND Semester=? AND \`UG/PG\`=?;`,
      [academicyear, section, dept, sem, degree],
      (error, result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(400).send({ msg: "error" });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(200).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
