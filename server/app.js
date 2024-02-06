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

app.post("/", (req, res) => {
  const data = req.body;
  try {
    db.query(
      "CREATE TABLE IF NOT EXISTS feedbacklogin (id INT PRIMARY KEY AUTO_INCREMENT, date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, dept VARCHAR(20), sem INT, username VARCHAR(30), password VARCHAR(30));",
      (error, result) => {
        if (result) {
          let parameters = [];
          let placeholder = [];
          for (let i = 0; i < data.count; i++) {
            parameters = [
              ...parameters,
              data.dept,
              data.sem,
              data.dept + data.sem.toString() + (100 + i + 1),
              data.dept + "@" + data.sem + (100 + i + 1),
            ];
            placeholder = [...placeholder, "(?,?,?,?)"];
          }

          db.query(
            `insert into feedbacklogin(dept,sem,username,password) values${placeholder}`,
            parameters,
            (error, result) => {
              if (result) {
                res.status(200).send({ msg: "inserted" });
              } else {
                res.status(400).send({ msg: "error" });
              }
            }
          );
        } else {
          res.status(400).send({ msg: "error" });
        }
      }
    );
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
