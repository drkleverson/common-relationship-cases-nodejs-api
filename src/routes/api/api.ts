var express = require("express");

const api = express.Router();

const teamsRoute = require("./teamsRoute");
const employeesRoute = require("./employeesRoute");
const providersRoute = require("./providersRoute");

api.use("/teams", teamsRoute);
api.use("/employees", employeesRoute);
api.use("/providers", providersRoute);

export default api;
