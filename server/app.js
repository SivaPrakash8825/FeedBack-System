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

app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:4173",
      "http://localhost:8082",
      "http://localhost:5173",
      "http://172.16.6.203:8082",
    ],
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
    4: "D",
    5: "E",
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
    // console.log(type);
    const query =
      type == "others"
        ? `SELECT * FROM questions where type NOT IN ('lab', 'infra', 'theory');`
        : `SELECT * FROM questions WHERE type='${type}'`;

    db.query(query, (err, ress) => {
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
app.post("/setQuestions/:typee", async (req, res) => {
  const { typee } = req.params;
  const data = req.body.data;
  try {
    const isOthers = typee == "others";
    // console.log(data);
    // db.query(`DELETE FROM questions where type = ?;`, [typee]);
    // db.query(`DELETE FROM questions where type = ?;`, [typee]);
    db.query(
      "CREATE TABLE if not exists `questions` (`id` int NOT NULL AUTO_INCREMENT,`question` varchar(250) NOT NULL,`type` varchar(10) NOT NULL,PRIMARY KEY (`id`,`question`,`type`));",
      async (err, ress) => {
        if (!err) {
          const values = isOthers
            ? data.map(({ type, question }) => [type, question])
            : data
                .filter(({ type }) => type === typee)
                .map(({ type, question }) => [type, question]);

          // console.log(values);

          const query = `REPLACE INTO questions (type,question) VALUES ?`;
          // console.log(query);
          isOthers
            ? transactionProcess(
                `questions where type not in ('lab','theory','infra')`,
                query,
                values,
                res
              )
            : transactionProcess(
                `questions where type = '${typee}'`,
                query,
                values,
                res
              );
          // db.query(query, (error, results) => {
          //   if (error) {
          //     return res.status(400).send(error.message);
          //   } else {
          //     return res.status(200).send("Questions Inserted :)");
          //   }
          // });
          // const query = `REPLACE INTO questions (id,type,question) VALUES ?`;
          // // console.log(query);
          // transactionProcess(
          //   `questions where type = '${typee}'`,
          //   query,
          //   values,
          //   res
          // );
          // db.query(query, (error, results) => {
          //   if (error) {
          //     return res.status(400).send(error.message);
          //   } else {
          //     return res.status(200).send("Questions Inserted :)");
          //   }
          // });
        } else {
          return res.status(400).send(err);
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
      d: 4,
      e: 5,
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
          db.query("select * from departments", (err, ress) => {
            if (err) {
              return res.status(400).send(err.message);
            }
            const dept = ress.map((key) => key.deptsname);
            const token = jwt.sign(
              { role: "admin", username: username },
              process.env.JWT_SECRETKEY + ""
            );
            req.session.user = token;
            return res.status(200).json({
              role: "admin",
              dept: result[0].dept === "all" ? dept : [result[0].dept],
            });
          });
        } else {
          db.query(
            "SELECT * FROM feedbackLogin WHERE username = ? and password = ? and validfrom <= CURDATE() AND validto >= CURDATE();",
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
                return res.status(200).send({ role: "user" });
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
  const { username, marks, coursecode, type, comments, stdtype, subgroup } =
    req.body;

  const detials = FindUserDetails(username);
  try {
    if (type.toLowerCase() == "infra") {
      db.query(
        `REPLACE INTO ${type}(username,stdtype,coursecode,academicyear,section,dept,sem,assessmenttype,degreetype,marks,comments,subgroup) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          username,
          stdtype,
          coursecode,
          detials.academicyear,
          detials.section,
          detials.dept,
          detials.sem,
          detials.assessmenttype,
          detials.degreetype,
          marks,
          comments,
          subgroup,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(400).send(error.message);
          }
          if (result) {
            res.status(200).send(result);
          }
          // console.log(error);
        }
      );
    } else {
      db.query(
        `REPLACE INTO ${type}(username,stdtype,coursecode,academicyear,section,dept,sem,assessmenttype,degreetype,marks,comments,subgroup) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          username,
          stdtype,
          coursecode,
          detials.academicyear,
          detials.section,
          detials.dept,
          detials.sem,
          detials.assessmenttype,
          detials.degreetype,
          marks,
          comments,
          subgroup,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(400).send(error.message);
          }
          if (result) {
            res.status(200).send(result);
          }
          // console.log(error);
        }
      );
    }
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
    academicyear,
    password,
    subtype,
  } = req.body;
  if (subtype == "infra") {
    db.query(
      `select * from infra WHERE academicyear=?`,
      [academicyear],
      (error, result) => {
        if (result) {
          // console.log(result);
          res.status(200).send(result);
        } else {
          res.status(400).send({ msg: error.message });
        }
      }
    );
  } else {
    db.query(
      `select t1.Staff,t1.\`Sub Name\`,t2.coursecode,t2.marks,t2.username,t2.stdtype as Board,t2.comments,t2.dept from mastertable as t1,${subtype} as t2 
      where t1.\`Academic yr\`=t2.academicyear AND t2.section=t1.Section AND t1.Semester=t2.sem And t1.\`Sub Code\` = t2.coursecode
      And t1.Dept=t2.dept AND t2.academicyear=? AND t2.dept=? AND t2.sem=? AND t2.section=? AND
      t2.assessmenttype=? AND t2.degreetype=?; `,
      [academicyear, dept, sem, section, assessmenttype, degree],
      (error, result) => {
        console.log(error);
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(400).send({ msg: error.message });
        }
      }
    );
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
    subtype,
  } = req.body;
  const acyr = academicyear.slice(0, 5) + academicyear.slice(-2);
  // console.log(
  //   acyr,
  //   dept,
  //   degree,
  //   sem,
  //   section,
  //   assessmenttype,
  //   subcode,
  //   subtype
  // );
  if (password == "Kcet@") {
    db.query(
      `SELECT a.\`Sub Code\`, a.\`Sub Name\`,a.\`StaffParent Dept\`,a.Staff,GROUP_CONCAT(c.marks SEPARATOR '-') AS subject_marks FROM mastertable a JOIN ${subtype} c ON a.\`Sub Code\` = c.coursecode AND c.academicyear = a.\`Academic yr\` and a.Dept = c.dept and a.Semester = c.sem and a.Section = c.section and a.\`UG/PG\` = c.degreetype WHERE a.\`Sub Code\` IN (SELECT coursecode FROM ${subtype} WHERE academicyear = ? AND dept = ? AND degreetype = ? AND sem = ? AND section = ? AND assessmenttype = ? ) GROUP BY a.\`Sub Code\`, a.\`Sub Name\`, a.Staff,a.\`StaffParent Dept\``,
      [acyr, dept, degree, sem, section, assessmenttype],
      (error, result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(400).send({ subtype, msg: error });
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
      4: "D",
      5: "E",
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

    const { academicyear, assessmenttype, degreetype, dept, section, sem } =
      FindUserDetails(username);

    const year = semToYearOptions[sem];

    db.query(
      "SELECT * FROM mastertable WHERE `Academic yr` = ? and Dept = ? and `UG/PG` = ? and Semester = ? and Section = ? AND (`Sub Code` not in (select coursecode from theory where username=? and coursecode=`Sub Code` and mastertable.`Theory/Lab`='Theory') AND `Sub Code` not in (select coursecode from lab where username=? and coursecode=`Sub Code` and mastertable.`Theory/Lab`='Lab')) AND (`Sub Grouping` not in (select subgroup from theory where username=? and subgroup=`Sub Grouping` and mastertable.`Theory/Lab`='Theory') AND `Sub Grouping` not in (select subgroup from lab where username=? and subgroup=`Sub Grouping` and mastertable.`Theory/Lab`='Lab'));",
      [
        academicyear,
        dept,
        degreetype,
        sem,
        section,
        username,
        username,
        username,
        username,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send(err.message);
        }

        if (assessmenttype !== "POST") {
          return res.status(200).send({
            courses: [...result],
            academicyear,
            dept,
            degreetype,
            sem,
            section,
            year,
            username,
          });
        }

        db.query(
          "SELECT * FROM mastertable WHERE `Theory/Lab` = 'Infra' and `Sub Code` not in (SELECT coursecode from infra where username = ?);",
          [username],
          (errr, ress) => {
            if (errr) return res.status(400).send(errr.message);

            // ret  res.status(200).send(ress)
            if (ress.length != 0 || result.length != 0) {
              return res.status(200).send({
                courses: [...result, ...ress],
                academicyear,
                dept,
                degreetype,
                sem,
                section,
                year,
                username,
              });
            } else {
              return res.status(200).send("Data Not Found!");
            }
          }
        );
        // console.log(result);

        // console.log("Data Not Found!");
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

// get department data
app.get("/getDepartments", (req, res) => {
  try {
    db.query(
      `SELECT deptsname, deptname, deptfullname FROM departments`,
      (err, ress) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        // console.log(ress);
        if (ress.length == 0) {
          db.query(
            " SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'theory';",
            (errr, resss) => {
              if (errr) {
                return res.status(200).send(errr);
              }
              // console.log(resss);
              return res.status(200).send(resss);
            }
          );
        } else return res.status(200).send(ress);
      }
    );
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// set department data
app.post("/setDepartments", (req, res) => {
  const { data } = req.body;
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS `departments` (`deptid` int NOT NULL AUTO_INCREMENT,`deptsname` varchar(10) NOT NULL,`deptname` varchar(10) NOT NULL,`deptfullname` varchar(45) NOT NULL,PRIMARY KEY (`deptid`,`deptsname`,`deptname`));",
      (err, ress) => {
        if (!err) {
          // const columnNames = Object.keys(data[0]).map(
          //   (column) => `\`${column}\``
          // );
          const insertQuery = `REPLACE INTO departments (deptsname, deptname, deptfullname) VALUES ?`;

          // console.log(colomnNames);
          const values = data.map(({ deptsname, deptname, deptfullname }) => [
            deptsname,
            deptname,
            deptfullname,
          ]);
          transactionProcess("departments", insertQuery, values, res);
          // db.query(`TRUNCATE TABLE departments`);
          // db.query(insertQuery, [values], (error, results) => {
          //   if (error) {
          //     return res.status(400).send(error.message);
          //   } else {
          //     return res.status(200).send("Department Inserted :)");
          //   }
          // });
        } else {
          res.status(200).send(err.message);
        }
      }
    );
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// get maseter login data
app.get("/getMasterLogin", (req, res) => {
  try {
    db.query(`SELECT dept,username,password FROM masterlogin`, (err, ress) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.status(200).send(ress);
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// set master login data
app.post("/setMasterLogin", (req, res) => {
  const { data } = req.body;
  try {
    db.query(
      "CREATE TABLE if not exists `masterlogin` (`id` int NOT NULL AUTO_INCREMENT,`dept` varchar(20) NOT NULL,`username` varchar(30) NOT NULL,`password` varchar(30) DEFAULT NULL,PRIMARY KEY (`id`,`dept`,`username`));",
      (err, ress) => {
        if (!err) {
          const insertQuery = `REPLACE INTO masterlogin (dept,username,password) VALUES ?`;

          // console.log(colomnNames);
          const values = data.map(({ dept, username, password }) => [
            dept,
            username,
            password,
          ]);
          transactionProcess("masterlogin", insertQuery, values, res);
          // db.query(`TRUNCATE TABLE departments`);
          // db.query(insertQuery, [values], (error, results) => {
          //   if (error) {
          //     return res.status(400).send(error.message);
          //   } else {
          //     return res.status(200).send("Department Inserted :)");
          //   }
          // });
        } else {
          res.status(200).send(err.message);
        }
      }
    );
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// get master data

app.get("/getMasterData/:dept/:academicYear", (req, res) => {
  const { dept, academicYear } = req.params;
  // console.log(dept, academicYear);
  try {
    let query;
    let params = [];

    if (dept === "all dept" && academicYear === "all") {
      query = "SELECT * FROM mastertable;";
    } else if (dept === "all dept") {
      query = `SELECT * FROM mastertable WHERE \`Academic yr\` = ?;`;
      params = [academicYear];
    } else if (academicYear === "all") {
      query = `SELECT \`Academic yr\`, \`UG/PG\`, \`Theory/Lab\`, Semester, Section, \`Sub Code\`, \`Sub Name\`, Staff, \`StaffParent Dept\`, \`Open Elective/Regular/Core Elective\`, \`Sub Grouping\`
      FROM mastertable WHERE Dept = ?;`;
      params = [dept];
    } else {
      query = `SELECT * FROM mastertable WHERE Dept = ? AND \`Academic yr\` = ?;`;
      params = [dept, academicYear];
    }

    db.query(query, params, (err, ress) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.status(200).send(ress);
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// set master data

app.post("/setMasterData/:dept/:academicYear", (req, res) => {
  const { dept, academicYear } = req.params;
  console.log(dept, academicYear);
  const { data } = req.body;
  const isAll = dept == "all dept";

  try {
    const values = data
      .filter(({ Dept }) => (isAll ? true : Dept === dept))
      .map(
        ({
          "Academic yr": academicYear,
          Dept,
          "UG/PG": ugpg,
          "Theory/Lab": theoryLab,
          Semester,
          Section,
          "Sub Code": subCode,
          "Sub Name": subName,
          Staff,
          "StaffParent Dept": staffParentDept,
          "Open Elective/Regular/Core Elective": electiveType,
          "Sub Grouping": subGrouping,
        }) => [
          academicYear,
          Dept,
          ugpg,
          theoryLab,
          Semester,
          Section,
          subCode,
          subName,
          Staff,
          staffParentDept,
          electiveType,
          subGrouping,
        ]
      );

    // Construct the REPLACE INTO query
    const query = `REPLACE INTO mastertable (\`Academic yr\`, Dept, \`UG/PG\`, \`Theory/Lab\`, Semester, Section, \`Sub Code\`, \`Sub Name\`, Staff, \`StaffParent Dept\`, \`Open Elective/Regular/Core Elective\`, \`Sub Grouping\`) VALUES ?`;

    transactionProcess(
      isAll && academicYear == "all"
        ? "mastertable"
        : isAll
        ? `mastertable where \`Academic yr\` = '${academicYear}'`
        : academicYear == "all"
        ? `mastertable where Dept = '${dept}'`
        : `mastertable where Dept = '${dept}' AND \`Academic yr\` = '${academicYear}'`,
      query,
      values,
      res
    );
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
});
app.get("/getdeletiondata/:type", (req, res) => {
  const { type } = req.params;
  try {
    if (type == "Feedbacklogin") {
      db.query(
        `SELECT DISTINCT DATE_FORMAT(STR_TO_DATE(validto, '%Y-%m-%dT%H:%i:%s.%fZ'), '%Y-%m-%d')  as validto  FROM ${type.toLowerCase()} WHERE CURDATE()>DATE_FORMAT(STR_TO_DATE(validto, '%Y-%m-%dT%H:%i:%s.%fZ'), '%Y-%m-%d')`,
        (error, result) => {
          if (error) {
            res.status(400).send(error);
          }
          res.status(200).send(result);
        }
      );
    } else {
      db.query(
        `select assessmenttype,academicyear,dept,sem,section from ${type} group by dept,sem,section,academicyear,assessmenttype;`,
        (error, result) => {
          if (error) {
            res.status(400).send(error);
          }
          res.status(200).send(result);
        }
      );
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/deleterecords", (req, res) => {
  const { data } = req.body;
  // console.log(data);

  try {
    if (data.table == "Feedbacklogin") {
      db.query(
        `select username from feedbacklogin where CURDATE()>validto`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(400).send(e);
          }
          const rows = result.map((key) => key.username);
          db.query(
            `delete from feedbacklogin where username in (?)`,
            [rows],
            (err, ress) => {
              if (err) {
                res.status(400).send(err);
              }
              return res.status(200).send(ress);
            }
          );
        }
      );
    } else {
      const val = data.option.split("/");
      const academicyear = val[1];
      const dept = val[2];
      const sem = parseInt(val[3]);
      const section = val[4];
      // console.log(data.table, val[0], academicyear, dept, sem, section);
      db.query(
        `select username from ${data.table} where assessmenttype=? AND academicyear=? AND dept=? AND sem=? AND section=?;`,
        [val[0].trim(), academicyear.trim(), dept.trim(), sem, section.trim()],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(400).send(e);
          }
          const row = result.map((key) => key.username);
          db.query(
            `DELETE FROM ${data.table} where username in (?)`,
            [row],
            (errr, ress) => {
              if (errr) {
                console.log(errr);
                res.status(400).send(errr);
              }
              res.status(200).send(ress);
            }
          );
        }
      );
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

const transactionProcess = (tablename, insertQuery, insertData, res) => {
  try {
    db.beginTransaction((err) => {
      if (err) {
        console.log(err.message);
        res.status(400).send(err.message);
      }

      console.log(`DELETE FROM ${tablename};`);
      // Delete existing data
      db.query(`DELETE FROM ${tablename};`, (error, results) => {
        if (error) {
          return db.rollback(() => {
            console.log(error.message);
            res.status(400).send(error.message);
          });
        }

        console.log("Table Deleted");
        // console.log(insertQuery, insertData);
        // Insert new data
        db.query(insertQuery, [insertData], (error, results) => {
          if (error) {
            return db.rollback(() => {
              console.log(error.message);
              res.status(400).send(error.message.split(":")[1]);
            });
          }

          // Commit transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.log(err.message);
                res.status(400).send(err.message);
              });
            }
            console.log("Transaction successfully completed.");
            res.send("Data Inserted :)");
          });
        });
      });
    });
  } catch (error) {
    console.log(error.message.split(":")[1]);
  }
};
app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
