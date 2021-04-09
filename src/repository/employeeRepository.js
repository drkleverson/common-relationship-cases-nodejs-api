const { TABLES, FK } = require("../db/consts");
const db = require("../db/connection");
const { TYPES } = require("tedious");

exports.getEmployees = async () => {
  let sql = `SELECT * FROM ${TABLES.EMPLOYEES} ORDER BY ID`;
  let employee = await db.rawQuery(sql);
  return { data: { employee: employee } };
};

exports.getEmployeeById = async (id) => {
  let sqlEmployee = `SELECT ID, NOME FROM ${TABLES.EMPLOYEES} WHERE ID = ${id}`;
  let employee = await db.rawQuery(sqlEmployee);
  if (!employee.length) {
    return false;
  }
  return { data: { employee: employee } };
};

exports.getEmployeeTeamsById = async (id) => {
  let employeeReturn = await this.getEmployeeById(id);
  let employee = employeeReturn.data.employee;

  if (!employee.length) {
    return false;
  }

  let sqlEmployeeTeams = `SELECT c.ID, c.ID_PARENT, c.NOME FROM ${TABLES.EMPLOYEES} a INNER JOIN ${TABLES.EMPLOYEES_X_TEAMS} b ON a.ID = b.${FK.EMPLOYEES_FK} INNER JOIN ${TABLES.TEAMS} c ON b.${FK.TEAMS_FK} = c.ID WHERE a.id = ${id}`;
  let employeeTeams = await db.rawQuery(sqlEmployeeTeams);
  return { data: { employee: employee[0], teams: employeeTeams } };
};

exports.addEmployee = async (body) => {
  let employee = {
    NOME: { value: body.name, type: TYPES.VarChar },
  };
  let insertReturn = db.insert(TABLES.EMPLOYEES, employee, "INSERTED.*");
  return insertReturn;
};

exports.updateEmployee = async (body) => {
  let employee = {
    NOME: { value: body.name, type: TYPES.VarChar },
  };
  let updateResponse = db.update(
    TABLES.EMPLOYEES,
    params.id,
    employee,
    "INSERTED.*"
  );
  return updateResponse;
};

exports.putEmployeeTeamsById = async (body, id) => {
  let deleteRelationshipSql = `DELETE FROM ${TABLES.EMPLOYEES_X_TEAMS} WHERE ${FK.EMPLOYEES_FK} = ${params.id}`;
  await db.rawQuery(deleteRelationshipSql);

  for (id of body.ids) {
    let updateRelationshipSql = `INSERT ${TABLES.EMPLOYEES_X_TEAMS} (${FK.EMPLOYEES_FK},${FK.TEAMS_FK}) VALUES (${params.id},${id})`;
    await db.rawQuery(updateRelationshipSql);
  }
  return;
};

exports.deleteEmployeeById = async (id) => {
  return db.delete(TABLES.EMPLOYEES, params.id);
};
