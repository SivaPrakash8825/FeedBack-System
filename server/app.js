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
app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
