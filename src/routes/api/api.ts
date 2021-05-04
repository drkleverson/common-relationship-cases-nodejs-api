var express = require("express");

const api = express.Router();

import employeesRoute from "./employeesRoute";

api.use("/employees", employeesRoute);

export default api;
