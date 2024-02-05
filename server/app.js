const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const port = process.env.PORT || 3010;

dotenv.config({
  path: "./.env",
});

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());
app.use(
  cors({
    origin: "",
    credentials: true,
  })
);

const con = mysql.createConnection({
  host: process.env.DBHOSTNAME,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
});

app.get("/", (req, res) => {
  let data = [
    { name: "siva", age: 1 },
    { name: "prakash", age: 65 },
  ];

  const values = data.map(() => "(?, ?)").join(", ");
  const query = `INSERT INTO  master(name, age) VALUES ${values}`;

  // Flatten the values array to create a single array of parameters
  const parameters = data.reduce(
    (acc, { name, age }) => [...acc, name, age],
    []
  );
  // Execute the query
  con.query(query, parameters, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
    } else {
      console.log("Data inserted successfully.");
    }
  });
});
con.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("DB connected");
  }
});
app.listen(port, () => {
  console.log(`server start listening on ${port}`);
});
