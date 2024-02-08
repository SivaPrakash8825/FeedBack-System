const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const db = require("./db");
const questions = require("./constants");

// Create Table questions & insert questions to it.
const createQuestions = () => {
  // Creates Table
  db.query(
    "CREATE TABLE IF NOT EXISTS questions (`id` INT NOT NULL ,`question` VARCHAR(250) PRIMARY KEY NOT NULL,type TEXT);",
    (err, res) => {
      if (!err) {
        // Add Questions to table
        const values = questions
          .map(
            ({ id, type, question }) =>
              `(${id},'${type}','${JSON.stringify(question)}')`
          )
          .join(",");
        const query = `REPLACE INTO questions (id,type, question) VALUES ${values}`;

        db.query(query, (error, results) => {
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
      "CREATE TABLE IF NOT EXISTS masterLogin (id INT NOT NULL,dept VARCHAR(20),username VARCHAR(30),password VARCHAR(30),PRIMARY KEY (dept,username));",
      (err, res) => {
        if (!err) {
          const query =
            "REPLACE INTO masterLogin (id,dept, username,password) VALUES (?,?,?,?);";

          db.query(query, [1, "all", "admin", "admin"], (error, results) => {
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
