var express=require("express");

const api = express.Router();

const teamsRoute = require("./teamsRoute");
const employeesRoute=require("./employeesRoute");

api.use("/teams", teamsRoute);
api.use("/employees", employeesRoute);

module.exports = api;