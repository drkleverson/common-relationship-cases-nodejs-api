const teamRepository = require("../repository/teamRepository");

//GET
exports.getTeams = (req, res) => {
  teamRepository
    .getTeams()
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.getTeamById = (req, res) => {
  const { params } = req;

  teamRepository
    .getTeamById(params.id)
    .then((result) => {
      if (!result) {
        return res.sendStatus(404);
      }

      res.status(200).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.getTeamEmployeesById = (req, res) => {
  const { params } = req;

  teamRepository
    .getTeamEmployeesById(params.id)
    .then((result) => {
      if (!result) {
        return res.sendStatus(404);
      }
      res.status(200).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.getTeamChildsById = (req, res) => {
  const { params } = req;

  teamRepository
    .getTeamChildsById(params.id)
    .then((result) => {
      if (!result) {
        return res.sendStatus(404);
      }
      res.status(200).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

//POST
exports.postTeam = (req, res) => {
  const { body } = req;

  teamRepository
    .addTeam(body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

//PUT
exports.putTeamById = (req, res) => {
  const { params, body } = req;

  teamRepository
    .updateTeam(body, params.id)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.putTeamEmployeesById = (req, res) => {
  const { params, body } = req;

  teamRepository
    .updateTeamEmployeesById(body, params.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

//DELETE
exports.deleteTeamById = (req, res) => {
  const { params } = req;

  teamRepository
    .deleteTeamById(params.id)
    .then((result) => {
      res.sendStatus(result ? 200 : 404);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};
