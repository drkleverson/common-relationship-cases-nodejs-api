import { rawQuery, insert, update, remove } from "../db/connection";
import { TYPES } from "tedious";

export async function getTeams() {
  let sql = `SELECT * FROM ${TABLES.TEAMS} ORDER BY ID`;
  let teams = await rawQuery(sql);
  return { data: { teams: teams } };
}

export async function getTeamById(id) {
  let sqlTeam = `SELECT ID, CODIGO, NOME FROM ${TABLES.TEAMS} WHERE ID = ${id}`;
  let team = await rawQuery(sqlTeam);
  if (!team.length) {
    return false;
  }
  return { data: team };
}

export async function getTeamEmployeesById(id) {
  let sqlTeam = `SELECT ID, NOME FROM ${TABLES.TEAMS} WHERE ID = ${id}`;
  let team = await rawQuery(sqlTeam);

  if (!team.length) {
    return false;
  }

  let sqlTeamEmployees = `SELECT c.ID, c.NOME FROM ${TABLES.TEAMS} a INNER JOIN ${TABLES.EMPLOYEES_X_TEAMS} b ON a.ID = b.${FK.TEAMS_FK} INNER JOIN ${TABLES.EMPLOYEES} c ON b.${FK.EMPLOYEES_FK} = c.ID WHERE a.id = ${id}`;
  let teamEmployees = await rawQuery(sqlTeamEmployees);
  return { data: { team: team[0], employees: teamEmployees } };
}

export async function getTeamChildsById(id) {
  let sqlTeam = `SELECT ID, NOME FROM ${TABLES.TEAMS} WHERE ID = ${id}`;
  let team = await rawQuery(sqlTeam);

  if (!team.length) {
    return false;
  }

  let sqlTeamChilds = `SELECT ID, NOME FROM ${TABLES.TEAMS} WHERE ID_PARENT = ${id}`;
  let teamChilds = await rawQuery(sqlTeamChilds);
  return { data: { team: team[0], teamChilds: teamChilds } };
}

export async function addTeam(body) {
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

  return insert(TABLES.TEAMS, team, "INSERTED.*");
}

export async function updateTeam(body, id) {
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

  return update(TABLES.TEAMS, id, team, "INSERTED.*");
}

export async function updateTeamEmployeesById(body, id) {
  let deleteRelationshipSql = `DELETE FROM ${TABLES.EMPLOYEES_X_TEAMS} WHERE ${FK.TEAMS_FK} = ${params.id}`;
  await rawQuery(deleteRelationshipSql);

  for (id of body.ids) {
    let updateRelationshipSql = `INSERT ${TABLES.EMPLOYEES_X_TEAMS} (${FK.EMPLOYEES_FK},${FK.TEAMS_FK}) VALUES (${id},${params.id})`;
    await rawQuery(updateRelationshipSql);
  }
  return;
}

export async function deleteTeamById(id) {
  return remove(TABLES.TEAMS, id);
}
