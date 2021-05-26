import { TABLES } from "../db/consts";
import * as db from "../db/connection";

export async function getCustomers() {
  let sql = `SELECT * FROM ${TABLES.CUSTOMERS} ORDER BY ID`;
  let result = await db.rawQuery(sql);
  if (!result?.rowsAffected[0]) {
    return false;
  }
  return { data: { customers: result?.recordset } };
}
