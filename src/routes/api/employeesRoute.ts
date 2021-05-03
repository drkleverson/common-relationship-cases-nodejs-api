import express from "express";

const employeeController = require("../../controllers/employeeController");

const employeesRouter = express.Router();

//lista todos os funcionários
employeesRouter.get("/", employeeController.getEmployees);

//busca apenas um funcionário pelo id
employeesRouter.get("/:id", employeeController.getEmployeeById);

//busca as equipes de um funcionário pelo id
employeesRouter.get("/:id/teams", employeeController.getEmployeeTeamsById);

//cadastra um funcionário
employeesRouter.post("/", employeeController.postEmployee);

//atualiza um funcionário pelo id
employeesRouter.put("/:id", employeeController.putEmployeeById);

//atualiza as equipes de um funcionário pelo id
employeesRouter.put("/:id/teams", employeeController.putEmployeeTeamsById);

//deleta funcionário pelo id
employeesRouter.delete("/:id", employeeController.deleteEmployeeById);

module.exports = employeesRouter;
