const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");

const mongodb = require("./data/database");
const swaggerDocument = require("./swagger.json");

const port = process.env.PORT || 3000;

app.use(express.json());

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.use("/", require("./routes"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.listen(port, () => {
      console.log(`Server initialized and running on port ${port}`);
    });
  }
});
