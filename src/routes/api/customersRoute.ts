import express from "express";
import * as customerController from "../../controllers/customerController";

const customerRouter = express.Router();
//lista todos os funcionários
customerRouter.get("/", customerController.getCustomers);

export default customerRouter;
