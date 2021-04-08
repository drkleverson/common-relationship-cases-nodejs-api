const { TABLES } = require("../db/consts");
const db = require("../db/connection");
const { TYPES } = require("tedious");

exports.getTeams = (req, res) => {
  let sql = `SELECT * FROM ${TABLES.TEAMS} ORDER BY ID`;
  db.rawQuery(sql)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.getTeamById = (req, res) => {
  let { params } = req;

  async function response() {
    let sqlTeam = `SELECT ID, CODIGO, NOME FROM ${TABLES.TEAMS} WHERE ID = ${params.id}`;
    let team = await db.rawQuery(sqlTeam);
    if (!team.length) {
      return false;
    }
    return team;
  }

  response()
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

exports.postTeam = (req, res) => {
  const { body } = req;
  let team = {
    NOME: { value: body.name, type: TYPES.VarChar },
    CODIGO: { value: body.code, type: TYPES.VarChar },
  };

  if (body.parentId) {
    team = {
      ...team,
      ID_PARENT: { value: body.parentId, type: TYPES.Int },
    };
  }

  db.insert(TABLES.TEAMS, team, "INSERTED.*")
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.putTeamById = (req, res) => {
  let { params } = req;

  let team = {
    NOME: { value: req.body.name, type: TYPES.VarChar },
    DM_STATUS: { value: 1, type: TYPES.Int },
  };

  db.update(TABLES.TEAMS, params.id, team, "INSERTED.*")
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.deleteTeamById = (req, res) => {
  let { params } = req;

  db.delete(TABLES.TEAMS, params.id)
    .then((result) => {
      res.sendStatus(result ? 200 : 404);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};
