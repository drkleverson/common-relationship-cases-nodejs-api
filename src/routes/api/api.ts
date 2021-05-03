var express = require("express");

const api = express.Router();

const employeesRoute = require("./employeesRoute");

api.use("/employees", employeesRoute);

export default api;
