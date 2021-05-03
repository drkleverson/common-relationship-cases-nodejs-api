import sql from "mssql";
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: String(process.env.DB_HOST),
  database: process.env.DB_DATABASE,
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// If no error, then good to proceed.
export async function rawQuery(rawSql: string) {
  await poolConnect;
  try {
    const request = pool.request();
    const result = await request.query(rawSql);
    return result;
  } catch (e) {
    console.dir(e);
  }
}
interface IField {
  field: string;
  value: any;
}

interface IInsert {
  table: string;
  fields: IField[];
  output: string;
}

interface IUpdate {
  table: string;
  id: number;
  fields: IField[];
  output?: string;
}

interface IDelete {
  table: string;
  id: number;
}

export async function insert(insert: IInsert) {
  const { table, fields, output } = insert;
  let fieldsName = fields.map((f) => f.field);

  let rawSql = `INSERT ${table} (${fieldsName.join(",")}) ${
    output ? `OUTPUT ${output}` : ``
  } VALUES (${fieldsName.map((v) => `@${v}`).join(",")});`;

  const pool = await poolConnect;
  const request = pool.request();

  for (let index in fields) {
    request.input(fields[index].field, fields[index].value);
  }

  try {
    const result = await request.query(rawSql);
    return result;
  } catch (e) {
    console.dir(e.message);
  }
}
export async function update(update: IUpdate) {
  const { table, fields, id, output } = update;
  let fieldsName = fields.map((f) => f.field);

  let rawSql = `UPDATE ${table} SET ${fieldsName.map((v) => `${v}=@${v}`)} ${
    output ? `OUTPUT ${output}` : ``
  } WHERE id=@id;`;

  const pool = await poolConnect;
  const request = pool.request();

  request.input("id", id);

  for (let index in fields) {
    request.input(fields[index].field, fields[index].value);
  }

  try {
    const result = await request.query(rawSql);
    return result;
  } catch (e) {
    console.dir(e.message);
  }
}
export async function remove(remove: IDelete) {
  const { table, id } = remove;

  let rawSql = `DELETE FROM ${table} WHERE id=@id`;

  const pool = await poolConnect;
  const request = pool.request();

  request.input("id", id);

  try {
    const result = await request.query(rawSql);
    return result;
  } catch (e) {
    console.dir(e.message);
  }
}
