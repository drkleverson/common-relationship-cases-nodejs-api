var express = require("express");

const api = express.Router();

import employeesRoute from "./employeesRoute";
import customersRoute from "./customersRoute";

api.use("/employees", employeesRoute);
api.use("/customers", customersRoute);

export default api;
