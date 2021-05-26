import * as employeeRepository from "../repository/employeeRepository";
import { Request, Response } from "express";
import fs from "fs";

//GET
export const getEmployees = async (req: Request, res: Response) => {
  const result = await employeeRepository.getEmployees();
  res.send(result);
};

export const getEmployeeById = async (req: Request, res: Response) => {
  const { params } = req;

  const result = await employeeRepository.getEmployeeById(Number(params.id));
  if (!result) {
    return res.sendStatus(404);
  }
  return res.status(200).send(result);
};

export const getEmployeeTeamsById = async (req: Request, res: Response) => {
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
export const postEmployee = async (req: Request, res: Response) => {
  const { body } = req;

  const result = await employeeRepository.addEmployee(body);
  return res.status(201).send(result);
};

//PUT
export const putEmployeeById = async (req: Request, res: Response) => {
  const { body, params } = req;

  const result = await employeeRepository.updateEmployee(
    body,
    Number(params.id)
  );
  res.status(201).send(result);
};

export const putEmployeeTeamsById = async (req: Request, res: Response) => {
  const { params, body } = req;

  const result = await employeeRepository.putEmployeeTeamsById(
    body,
    Number(params.id)
  );
  res.status(200).send(result);
};

//DELETE
export const deleteEmployeeById = async (req: Request, res: Response) => {
  const { params } = req;

  const result = await employeeRepository.deleteEmployeeById(Number(params.id));
  res.sendStatus(result ? 200 : 404);
};

//PROCEDURE

export const insertLead = async (req: Request, res: Response) => {
  const { body } = req;

  const result = await employeeRepository.insertLead(body);
  res.status(result.status).send(result.data);
};

export const upload = async (req: Request, res: Response) => {
  const { body } = req;
  const file = { buffer: fs.readFileSync(req.file.path), path: req.file.path };
  const result = await employeeRepository.upload(file, body);
  res.status(result.status).send(result.data);
};