const swaggerAutogen = require("swagger-autogen")();

const doc = {
  swagger: "2.0",
  info: {
    title: "CSE341 Final Project",
    description: "API documentation / testing"
  },
  host: "localhost:3000",
  schemes: ["http"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
