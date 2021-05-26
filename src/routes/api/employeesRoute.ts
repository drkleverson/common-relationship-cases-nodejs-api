import express from "express";

import multer from "multer";
import * as employeeController from "../../controllers/employeeController";

const employeesRouter = express.Router();
const upload = multer({ dest: "uploads/" });

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

//insere lead
employeesRouter.post("/insertLead", employeeController.insertLead);

//upload
employeesRouter.post(
  "/upload",
  upload.single("avatar"),
  employeeController.upload
);

export default employeesRouter;
