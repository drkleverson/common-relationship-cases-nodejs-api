const { TABLES, FK } = require("../db/consts");
const db = require("../db/connection");
const { TYPES } = require("tedious");

exports.getTeams = async () => {
  let sql = `SELECT * FROM ${TABLES.TEAMS} ORDER BY ID`;
  let teams = await db.rawQuery(sql);
  return { data: { teams: teams } };
};

exports.getTeamById = async (id) => {
  let sqlTeam = `SELECT ID, CODIGO, NOME FROM ${TABLES.TEAMS} WHERE ID = ${id}`;
  let team = await db.rawQuery(sqlTeam);
  if (!team.length) {
    return false;
  }
  return { data: team };
};

exports.getTeamEmployeesById = async (id) => {
  let sqlTeam = `SELECT ID, NOME FROM ${TABLES.TEAMS} WHERE ID = ${id}`;
  let team = await db.rawQuery(sqlTeam);

  if (!team.length) {
    return false;
  }

  let sqlTeamEmployees = `SELECT c.ID, c.NOME FROM ${TABLES.TEAMS} a INNER JOIN ${TABLES.EMPLOYEES_X_TEAMS} b ON a.ID = b.${FK.TEAMS_FK} INNER JOIN ${TABLES.EMPLOYEES} c ON b.${FK.EMPLOYEES_FK} = c.ID WHERE a.id = ${id}`;
  let teamEmployees = await db.rawQuery(sqlTeamEmployees);
  return { data: { team: team[0], employees: teamEmployees } };
};

exports.getTeamChildsById = async (id) => {
  let sqlTeam = `SELECT ID, NOME FROM ${TABLES.TEAMS} WHERE ID = ${id}`;
  let team = await db.rawQuery(sqlTeam);

  if (!team.length) {
    return false;
  }

  let sqlTeamChilds = `SELECT ID, NOME FROM ${TABLES.TEAMS} WHERE ID_PARENT = ${id}`;
  let teamChilds = await db.rawQuery(sqlTeamChilds);
  return { data: { team: team[0], teamChilds: teamChilds } };
};

exports.addTeam = async (body) => {
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

  return db.insert(TABLES.TEAMS, team, "INSERTED.*");
};

exports.updateTeam = async (body, id) => {
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

  return db.update(TABLES.TEAMS, id, team, "INSERTED.*");
};

exports.updateTeamEmployeesById = async (body, id) => {
  let deleteRelationshipSql = `DELETE FROM ${TABLES.EMPLOYEES_X_TEAMS} WHERE ${FK.TEAMS_FK} = ${params.id}`;
  await db.rawQuery(deleteRelationshipSql);

  for (id of body.ids) {
    let updateRelationshipSql = `INSERT ${TABLES.EMPLOYEES_X_TEAMS} (${FK.EMPLOYEES_FK},${FK.TEAMS_FK}) VALUES (${id},${params.id})`;
    await db.rawQuery(updateRelationshipSql);
  }
  return;
};

exports.deleteTeamById = async (id) => {
  return db.delete(TABLES.TEAMS, id);
};
