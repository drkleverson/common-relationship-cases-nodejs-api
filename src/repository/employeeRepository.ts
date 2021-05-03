import { TABLES, FK } from "../db/consts";
import * as db from "../db/connection";

export async function getEmployees() {
  let sql = `SELECT * FROM ${TABLES.EMPLOYEES} ORDER BY ID`;
  let result = await db.rawQuery(sql);
  if (!result?.rowsAffected[0]) {
    return false;
  }
  return { data: { employees: result?.recordset } };
}

export async function getEmployeeById(id: number) {
  let sqlEmployee = `SELECT * FROM ${TABLES.EMPLOYEES} WHERE ID = ${id}`;
  let result = await db.rawQuery(sqlEmployee);
  if (!result?.rowsAffected[0]) {
    return false;
  }
  return { data: { employee: result?.recordset } };
}

export async function getEmployeeTeamsById(id: number) {
  let employeeReturn = await this.getEmployeeById(id);
  let employee = employeeReturn.data.employee;

  if (!employee.length) {
    return false;
  }

  let sqlEmployeeTeams = `SELECT c.ID, c.ID_PARENT, c.NOME FROM ${TABLES.EMPLOYEES} a INNER JOIN ${TABLES.EMPLOYEES_X_TEAMS} b ON a.ID = b.${FK.EMPLOYEES_FK} INNER JOIN ${TABLES.TEAMS} c ON b.${FK.TEAMS_FK} = c.ID WHERE a.id = ${id}`;
  let result = await db.rawQuery(sqlEmployeeTeams);
  return { data: { employee: employee[0], teams: result?.recordsets } };
}

export async function addEmployee(body: any) {
  let employee = [{ field: "NOME", value: body.name }];

  let result = await db.insert({
    table: TABLES.EMPLOYEES,
    fields: employee,
    output: "INSERTED.*",
  });

  if (!result?.rowsAffected[0]) {
    return false;
  }
  return { data: { employee: result?.recordset } };
}

export async function updateEmployee(body: any, id: number) {
  let employee = [{ field: "NOME", value: body.name }];

  let result = await db.update({
    table: TABLES.EMPLOYEES,
    id,
    fields: employee,
    output: "INSERTED.*",
  });

  if (!result?.rowsAffected[0]) {
    return false;
  }
  return { data: { employee: result?.recordset } };
}

export async function putEmployeeTeamsById(body: any, id: number) {
  let deleteRelationshipSql = `DELETE FROM ${TABLES.EMPLOYEES_X_TEAMS} WHERE ${FK.EMPLOYEES_FK} = ${id}`;
  await db.rawQuery(deleteRelationshipSql);

  for (id of body.ids) {
    let updateRelationshipSql = `INSERT ${TABLES.EMPLOYEES_X_TEAMS} (${FK.EMPLOYEES_FK},${FK.TEAMS_FK}) VALUES (${id},${id})`;
    await db.rawQuery(updateRelationshipSql);
  }
  return;
}

export async function deleteEmployeeById(id: number) {
  let result = await db.remove({ table: TABLES.EMPLOYEES, id });
  if (!result?.rowsAffected[0]) {
    return false;
  }
  return true;
}
