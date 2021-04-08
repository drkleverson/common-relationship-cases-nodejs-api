var express = require("express");

const teamsController = require("../../controllers/teamsController");

const teamsRouter = express.Router();

//busca todas as equipes
teamsRouter.get("/", teamsController.getTeams);

//retorna uma equipe buscando pelo id
teamsRouter.get("/:id", teamsController.getTeamById);

//busca os funcionarios de uma equipe
teamsRouter.get("/:id/employees", teamsController.getTeamEmployeesById);

//cadastra nova equipe, equipe poderá ter equipe pai
teamsRouter.post("/", teamsController.postTeam);

//atualiza equipe
teamsRouter.put("/:id", teamsController.putTeamById);

//atualiza os funcionário de uma equipe
teamsRouter.put("/:id/employees", teamsController.putTeamEmployeesById);

//deleta uma equipe
teamsRouter.delete("/:id", teamsController.deleteTeamById);

module.exports = teamsRouter;
