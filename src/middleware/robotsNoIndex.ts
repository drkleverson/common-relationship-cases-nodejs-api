import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  res.set("X-Robots-Tag", "none, noarchive");
  next();
};
