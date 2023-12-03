const express = require("express");
const routes = require("./routes");
const { dbConfig } = require("./config/dbConfig");
const app = express();

//Middilware Here
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//MongoDb Connected Here
dbConfig();

//Routes Here
app.use(routes);

//Port Connection Here
let port = process.env.PORT;
app.listen(port, () => {
  console.log(`Port On Connection ${port}`);
});
