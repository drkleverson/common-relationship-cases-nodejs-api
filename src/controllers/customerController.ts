import * as customerRepository from "../repository/customerRepository";
import { Request, Response } from "express";

export const getCustomers = async (req: Request, res: Response) => {
  const result = await customerRepository.getCustomers();
  res.send(result);
};