const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const db = require("./db");
const { masterTableData, questions, departments } = require("./constants");

// Create Table questions & insert questions to it.
const createQuestions = () => {
  // Creates Table
  db.query(
    "CREATE TABLE if not exists `questions` (`id` int NOT NULL AUTO_INCREMENT,`question` varchar(250) NOT NULL,`type` varchar(10) NOT NULL,PRIMARY KEY (`id`,`question`,`type`));",
    (err, res) => {
      if (!err) {
        const values = questions.map(({ id, type, question }) => [
          id,
          type,
          question,
        ]);

        const query = `REPLACE INTO questions (id,type,question) VALUES ?`;

        db.query(query, [values], (error, results) => {
          if (error) {
            console.log(error.message);
          } else {
            console.log("Questions Table Created & Questions Added");
          }
        });
      } else {
        console.log(err.message);
      }
    }
  );
};

createQuestions();

// Generates Table For Login
const generateLogin = () => {
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS feedbacklogin (id INT,validfrom DATE NOT NULL,validto DATE NOT NULL ,dept VARCHAR(20),sem INT,section VARCHAR(40),username VARCHAR(30),password VARCHAR(30),PRIMARY KEY (dept, sem, section,username));",
      (error, result) => {
        if (error) {
          return console.log(error);
        }
        return console.log("FeedbackLogin Table Created");
      }
    );
  } catch (e) {
    console.log(e.message);
  }
};
generateLogin();

// Create Table Master Login
const createMasterLogin = () => {
  try {
    db.query(
      "CREATE TABLE if not exists `masterlogin` (`id` int NOT NULL AUTO_INCREMENT,`dept` varchar(20) NOT NULL,`username` varchar(30) NOT NULL,`password` varchar(30) DEFAULT NULL,PRIMARY KEY (`id`,`dept`,`username`))",
      (err, res) => {
        if (!err) {
          const query =
            "REPLACE INTO masterLogin (dept, username,password) VALUES (?,?,?);";

          db.query(query, ["all", "admin", "admin"], (error, results) => {
            if (error) {
              console.log(error.message);
            } else {
              console.log("MasterLogin Data Inserted :)");
            }
          });
        } else {
          console.log(err.message);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

createMasterLogin();

// Create Table Master Table
const createMasterTable = () => {
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS `mastertable` (`Academic yr` varchar(100) NOT NULL,`Dept` varchar(20) NOT NULL,`UG/PG` varchar(20) NOT NULL,`Theory/Lab` VARCHAR(20),`Semester` varchar(10) NOT NULL,`Section` varchar(30) NOT NULL,`Sub Code` varchar(100) NOT NULL,`Sub Name` varchar(230) NOT NULL,`Staff` text,`StaffParent Dept` text,`Open Elective/Regular/Core Elective` text,`Sub Grouping` text,PRIMARY KEY (`Academic yr`,`Dept`,`UG/PG`,`Semester`,`Sub Name`,`Sub Code`,`Section`,`Theory/Lab`));",
      (err, res) => {
        if (!err) {
          const values = masterTableData
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
              }) =>
                `('${academicYear}', '${Dept}', '${ugpg}', '${theoryLab}', '${Semester}', '${Section}', '${subCode}', '${subName}', '${Staff}', '${staffParentDept}', '${electiveType}', '${subGrouping}')`
            )
            .join(",");

          // Construct the REPLACE INTO query
          const query = `REPLACE INTO mastertable (\`Academic yr\`, Dept, \`UG/PG\`, \`Theory/Lab\`, Semester, Section, \`Sub Code\`, \`Sub Name\`, Staff, \`StaffParent Dept\`, \`Open Elective/Regular/Core Elective\`, \`Sub Grouping\`) VALUES ${values}`;

          db.query(query, (err, result) => {
            if (err) {
              return console.log(err.message);
            }
            return console.log("Master Table Created & Master data Added");
          });

          // console.log("Master Table Created & Master data Added");
        } else {
          console.log(err.message);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

createMasterTable();

const createTheorytable = () => {
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS `feedback`.`theory` (`username` VARCHAR(30) NOT NULL,stdtype VARCHAR(3),`coursecode` VARCHAR(45) NOT NULL,`academicyear` VARCHAR(10) NULL,`section` VARCHAR(45) NOT NULL,`dept` VARCHAR(45) NOT NULL,`sem` INT NOT NULL,`assessmenttype` varchar(10) NOT NULL,`degreetype` VARCHAR(5) NULL,`marks` TEXT NULL,`comments` VARCHAR(400) NULL,subgroup varchar(20), PRIMARY KEY (`username`, `coursecode`, `section`, `dept`, `sem`));",
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("theory table created");
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const createLabtable = () => {
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS `feedback`.`lab` (`username` VARCHAR(30) NOT NULL,stdtype VARCHAR(3),`coursecode` VARCHAR(45) NOT NULL,`academicyear` VARCHAR(10) NULL,`section` VARCHAR(45) NOT NULL,`dept` VARCHAR(45) NOT NULL,`sem` INT NOT NULL,`assessmenttype` varchar(10) NOT NULL,`degreetype` VARCHAR(5) NULL,`marks` TEXT NULL,`comments` VARCHAR(400) NULL,subgroup varchar(20), PRIMARY KEY (`username`, `coursecode`, `section`, `dept`, `sem`));",
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("lab table created");
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

createLabtable();
createTheorytable();

const createDepartmentTable = () => {
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS `departments` (`deptid` int NOT NULL AUTO_INCREMENT,`deptsname` varchar(10) NOT NULL,`deptname` varchar(10) NOT NULL,`deptfullname` varchar(45) NOT NULL,PRIMARY KEY (`deptid`,`deptsname`,`deptname`));",
      (err, res) => {
        if (!err) {
          // Add Questions to table
          const values = departments
            .map(
              ({ deptsname, deptname, deptfullname }) =>
                `('${deptsname}','${deptname}','${deptfullname}')`
            )
            .join(",");
          const query = `REPLACE INTO departments (deptsname, deptname, deptfullname) VALUES ${values}`;

          db.query(query, (error, results) => {
            if (error) {
              console.log(error.message);
            } else {
              console.log("Departments Table Created & Departments Added");
            }
          });
        } else {
          console.log(err.message);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

createDepartmentTable();

const createInfratable = () => {
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS `feedback`.`infra` (`username` VARCHAR(30) NOT NULL,`coursecode` VARCHAR(45) NOT NULL,`academicyear` VARCHAR(10) NULL,`section` VARCHAR(45) NOT NULL,`dept` VARCHAR(45) NOT NULL,`sem` INT NOT NULL,`assessmenttype` varchar(10) NOT NULL,`degreetype` VARCHAR(5) NULL,`marks` TEXT NULL,`comments` VARCHAR(400) NULL,subgroup varchar(20), PRIMARY KEY (`username`, `coursecode`, `section`, `dept`, `sem`));",
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Infra table created");
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

createInfratable();
