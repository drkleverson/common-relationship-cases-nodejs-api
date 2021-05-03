import * as employeeRepository from "../repository/employeeRepository";
import { Request, Response, NextFunction } from "express";

//GET
exports.getEmployees = async (req: Request, res: Response) => {
  const result = await employeeRepository.getEmployees();
  res.send(result);
};

exports.getEmployeeById = async (req: Request, res: Response) => {
  const { params } = req;

  const result = await employeeRepository.getEmployeeById(Number(params.id));
  if (!result) {
    return res.sendStatus(404);
  }
  return res.status(200).send(result);
};

exports.getEmployeeTeamsById = async (req: Request, res: Response) => {
  const { params } = req;

  const result = await employeeRepository.getEmployeeTeamsById(
    Number(params.id)
  );
  if (!result) {
    return res.sendStatus(404);
  }
  res.status(200).send(result);
};

//POST
exports.postEmployee = async (req: Request, res: Response) => {
  const { body } = req;

  const result = await employeeRepository.addEmployee(body);
  return res.status(201).send(result);
};

//PUT
exports.putEmployeeById = async (req: Request, res: Response) => {
  const { body, params } = req;

  const result = await employeeRepository.updateEmployee(
    body,
    Number(params.id)
  );
  res.status(201).send(result);
};

exports.putEmployeeTeamsById = async (req: Request, res: Response) => {
  const { params, body } = req;

  const result = await employeeRepository.putEmployeeTeamsById(
    body,
    Number(params.id)
  );
  res.status(200).send(result);
};

//DELETE
exports.deleteEmployeeById = async (req: Request, res: Response) => {
  const { params } = req;

  const result = await employeeRepository.deleteEmployeeById(Number(params.id));
  res.sendStatus(result ? 200 : 404);
};
