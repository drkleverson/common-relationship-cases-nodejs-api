const { TABLES, FK } = require("../db/consts");
const db = require("../db/connection");
const { TYPES } = require("tedious");

exports.getEmployees = (req, res) => {
  let sql = `SELECT * FROM ${TABLES.EMPLOYEES} ORDER BY ID`;
  db.rawQuery(sql)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.getEmployeeById = (req, res) => {
  let { params } = req;

  async function response() {
    let sqlEmployee = `SELECT ID, NOME FROM ${TABLES.EMPLOYEES} WHERE ID = ${params.id}`;
    let employee = await db.rawQuery(sqlEmployee);
    if (!employee.length) {
      return false;
    }
    return { employee: employee };
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
exports.getEmployeeTeamsById = (req, res) => {
  let { params } = req;

  async function response() {
    let sqlEmployee = `SELECT ID, NOME FROM ${TABLES.EMPLOYEES} WHERE ID = ${params.id}`;
    let employee = await db.rawQuery(sqlEmployee);

    if (!employee.length) {
      return false;
    }

    let sqlEmployeeTeams = `SELECT c.ID, c.ID_PARENT, c.NOME FROM ${TABLES.EMPLOYEES} a INNER JOIN ${TABLES.EMPLOYEES_X_TEAMS} b ON a.ID = b.FK_X1101 INNER JOIN ${TABLES.TEAMS} c ON b.FK_X1105 = c.ID WHERE a.id = ${params.id}`;
    let employeeTeams = await db.rawQuery(sqlEmployeeTeams);
    return { employee: employee, teams: employeeTeams };
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

exports.postEmployee = (req, res) => {
  let employee = {
    NOME: { value: req.body.name, type: TYPES.VarChar },
    DM_STATUS: { value: 1, type: TYPES.Int },
  };

  db.insert(TABLES.EMPLOYEES, employee, "INSERTED.*")
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.putEmployeeById = (req, res) => {
  let { params } = req;

  let employee = {
    NOME: { value: req.body.name, type: TYPES.VarChar },
    DM_STATUS: { value: 1, type: TYPES.Int },
  };

  db.update(TABLES.EMPLOYEES, params.id, employee, "INSERTED.*")
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.putEmployeeTeamsById = (req, res) => {
  let { params, body } = req;

  async function response() {
    let deleteRelationshipSql = `DELETE FROM ${TABLES.EMPLOYEES_X_TEAMS} WHERE ${FK.EMPLOYEES_FK} = ${params.id}`;
    let deleteRelationshipResponse = await db.rawQuery(deleteRelationshipSql);

    for (id of body.ids) {
      let updateRelationshipSql = `INSERT ${TABLES.EMPLOYEES_X_TEAMS} (${FK.EMPLOYEES_FK},${FK.TEAMS_FK}) VALUES (${params.id},${id})`;
      let updateRelationshipResponse = await db.rawQuery(updateRelationshipSql);
    }
    return;
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

exports.deleteEmployeeById = (req, res) => {
  let { params } = req;

  db.delete(TABLES.EMPLOYEES, params.id)
    .then((result) => {
      res.sendStatus(result ? 200 : 404);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};
