var express = require("express");

const providersController = require("../../controllers/providersController");

const providersRoute = express.Router();

//lista todos os fornecedores
providersRoute.get("/", providersController.getProviders);

providersRoute.get("/:id", providersController.getProvidersById);

module.exports = providersRoute;
