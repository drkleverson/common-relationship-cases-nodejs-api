const teamRepository = require("../repository/teamRepository");
import { NextFunction, Request, Response } from "express";

//GET
exports.getTeams = (req: Request, res: Response) => {
  teamRepository
    .getTeams()
    .then((result:any) => {
      res.json(result);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};

exports.getTeamById = (req:Request, res:Response) => {
  const { params } = req;

  teamRepository
    .getTeamById(params.id)
    .then((result:any) => {
      if (!result) {
        return res.sendStatus(404);
      }

      res.status(200).send(result);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};

exports.getTeamEmployeesById = (req:Request, res:Response) => {
  const { params } = req;

  teamRepository
    .getTeamEmployeesById(params.id)
     .then((result:any) => {
      if (!result) {
        return res.sendStatus(404);
      }
      res.status(200).send(result);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};

exports.getTeamChildsById = (req:Request, res:Response) => {
  const { params } = req;

  teamRepository
    .getTeamChildsById(params.id)
     .then((result:any) => {
      if (!result) {
        return res.sendStatus(404);
      }
      res.status(200).send(result);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};

//POST
exports.postTeam = (req:Request, res:Response) => {
  const { body } = req;

  teamRepository
    .addTeam(body)
     .then((result:any) => {
      res.status(201).send(result);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};

//PUT
exports.putTeamById = (req:Request, res:Response) => {
  const { params, body } = req;

  teamRepository
    .updateTeam(body, params.id)
     .then((result:any) => {
      res.status(201).send(result);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};

exports.putTeamEmployeesById = (req:Request, res:Response) => {
  const { params, body } = req;

  teamRepository
    .updateTeamEmployeesById(body, params.id)
     .then((result:any) => {
      res.status(200).send(result);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};

//DELETE
exports.deleteTeamById = (req:Request, res:Response) => {
  const { params } = req;

  teamRepository
    .deleteTeamById(params.id)
     .then((result:any) => {
      res.sendStatus(result ? 200 : 404);
    })
    .catch((e:any) => {
      res.status(500).send(e.message);
    });
};
