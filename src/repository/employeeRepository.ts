import { TABLES, FK } from "../db/consts";
import jsonValidator = require("is-my-json-valid");
import * as db from "../db/connection";
import sql from "mssql";
import fs from "fs";

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

export async function insertLead(body: any) {
  const insertLeadValidator = jsonValidator(
    {
      type: "object",
      properties: {
        id_sessao: { type: "number" },
        id_parceiro: { type: "number" },
        id_loja: { type: "number" },
        id_produto: { type: "number", required: true },
        id_for_contato: { type: "number" },
        dm_pessoa: { type: "number" },
        ins_federal: { type: "number" },
        nome: { type: "string" },
        nm_contato: { type: "string" },
        fon_ddd: { type: "string" },
        fon_num: { type: "string" },
        email: { type: "string" },
        dt_pri_vencto: { type: "string" },
        vl_solicitado: { type: "string" },
        cd_anuncio: { type: "string" },
        dh_ini_cad: { type: "string" },
        dh_ter_cad: { type: "string" },
        ds_dados: { type: "string" },
      },
    },
    {
      verbose: true,
    }
  );

  const validateFields = insertLeadValidator.toJSON();

  const fields: any = [];

  Object.keys(validateFields.properties).map((field) => {
    fields.push({ field, value: body[field] });
  });

  if (!insertLeadValidator(body)) {
    return { status: 500, data: { errors: insertLeadValidator.errors } };
  }

  const outputs = [
    { field: "id", type: sql.Int },
    { field: "result", type: sql.Bit },
    { field: "msg", type: sql.VarChar },
  ];

  try {
    let result = await db.runProcedure({
      procedureName: "SP_API_T2004_C1",
      fields,
      outputs,
    });

    if (!result?.output?.result) {
      return { status: 500, data: "Erro interno ao inserir lead" };
    }
    return { status: 200, data: { id_lead: result.output.id } };
  } catch (e) {
    return { status: 500, data: "Erro interno" };
  }
}

export async function upload(file: any, body: any) {
  const insertLeadValidator = jsonValidator(
    {
      type: "object",
      properties: {
        id_sessao: { type: "string" || "number" },
        id_protocolo: { type: "string" || "number" },
        id_componente: { type: "string" || "number" },
        id_pendencia: { type: "string" || "number" },
        dm_tipo: { type: "string" || "number" },
        nome: { type: "string" },
        extensao: { type: "string" },
        tamanho: { type: "string" || "number" },
      },
    },
    {
      verbose: true,
    }
  );

  const validateFields = insertLeadValidator.toJSON();

  const fields: any = [];

  Object.keys(validateFields.properties).map((field) => {
    fields.push({ field, value: body[field] });
  });

  fields.push({ field: "arquivo", value: file.buffer });

  fs.unlinkSync(file.path);
  if (!insertLeadValidator(body)) {
    return { status: 500, data: { errors: insertLeadValidator.errors } };
  }

  const outputs = [
    { field: "id_arquivo", type: sql.Int },
    { field: "result", type: sql.Bit },
    { field: "msg", type: sql.VarChar },
  ];

  return { status: 200, data: "Erro interno ao inserir lead" };
  try {
    let result = await db.runProcedure({
      procedureName: "SP_T2103_C1",
      fields,
      outputs,
    });

    if (!result?.output?.result) {
      return { status: 500, data: "Erro interno ao inserir lead" };
    }
    return { status: 200, data: { id_arquivo: result.output.id_arquivo } };
  } catch (e) {
    return { status: 500, data: "Erro interno" };
  }
}
