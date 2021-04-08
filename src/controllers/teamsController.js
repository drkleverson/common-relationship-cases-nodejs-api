const { TABLES, FK } = require("../db/consts");
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
  const { params, body } = req;

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

exports.getTeamEmployeesById = (req, res) => {
  const { params } = req;

  async function response() {
    let sqlTeam = `SELECT ID, NOME FROM ${TABLES.TEAMS} WHERE ID = ${params.id}`;
    let team = await db.rawQuery(sqlTeam);

    if (!team.length) {
      return false;
    }

    let sqlTeamEmployees = `SELECT c.ID, c.NOME FROM ${TABLES.TEAMS} a INNER JOIN ${TABLES.EMPLOYEES_X_TEAMS} b ON a.ID = b.${FK.TEAMS_FK} INNER JOIN ${TABLES.EMPLOYEES} c ON b.${FK.EMPLOYEES_FK} = c.ID WHERE a.id = ${params.id}`;
    let teamEmployees = await db.rawQuery(sqlTeamEmployees);
    return { team: team[0], employees: teamEmployees };
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

exports.putTeamEmployeesById = (req, res) => {
  let { params, body } = req;

  async function response() {
    let deleteRelationshipSql = `DELETE FROM ${TABLES.EMPLOYEES_X_TEAMS} WHERE ${FK.TEAMS_FK} = ${params.id}`;
    let deleteRelationshipResponse = await db.rawQuery(deleteRelationshipSql);

    for (id of body.ids) {
      let updateRelationshipSql = `INSERT ${TABLES.EMPLOYEES_X_TEAMS} (${FK.EMPLOYEES_FK},${FK.TEAMS_FK}) VALUES (${id},${params.id})`;
      await db.rawQuery(updateRelationshipSql);
    }
    return;
  }
  response()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};
