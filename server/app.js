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
    db.query("Select * from questions", (err, ress) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.send(ress);
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// // get question data
// app.post("/setQuestions", (req, res) => {
//   try {
//     db.query("Select * from questions", (err, ress) => {
//       if (err) {
//         return res.status(400).send(err.message);
//       }
//       return res.send(ress);
//     });
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// });

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
