import { TYPES, Connection, Request } from "tedious";
require("dotenv").config();

export const config = {
  server: process.env.DB_HOST,
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
  options: {
    port: Number(process.env.DB_PORT),
    trustServerCertificate: true,
    rowCollectionOnDone: true,
    validateBulkLoadParameters: false,
    encrypt: false,
    database: process.env.DB_DATABASE,
  },
};

// If no error, then good to proceed.
export async function rawQuery(sql:string) {
  return await new Promise((resolve, reject) => {
    const jsonArray = [];
    let connection = new Connection(config);
    connection.connect();

    const request = new Request(sql, function (err, rowCount, rows) {
      if (err) {
        return reject(err);
      }
      connection.close();
    });

    request.on("row", function (columns) {
      let rowObject = {};

      columns.forEach(function (column) {
        rowObject[column.metadata.colName] = column.value;
      });
      jsonArray.push(rowObject);
    });

    request.on("doneProc", function (rowCount, more, returnStatus, rows) {
      return resolve(jsonArray);
    });

    connection.on("connect", function (err) {
      if (err) {
        process.exit(1);
      }
      connection.execSql(request);
    });
  });
}

export function insert(table:String, values:any, output = null) {
  return new Promise((resolve, reject) => {
    let keys = Object.keys(values);
    var rowObject = {};

    let sql = `INSERT ${table} (${keys.join(",")}) ${output ? `OUTPUT ${output}` : ``} VALUES (${keys.map((v) => `@${v}`).join(",")});`;

    let connection = new Connection(config);
    connection.connect();

    const request = new Request(sql, function (err) {
      if (err) {
        return reject(err);
      }
      connection.close();
    });

    for (let key in values) {
      request.addParameter(key, values[key].type, values[key].value);
    }

    request.on("row", function (columns) {
      columns.forEach(function (column) {
        rowObject[column.metadata.colName] = column.value;
      });
    });

    request.on("doneProc", function (rowCount, more, returnStatus, rows) {
      return resolve(rowObject);
    });

    connection.on("connect", function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      connection.execSql(request);
    });
  });
}

export function update(table:String, id:Number, values:any, output = false) {
  return new Promise((resolve, reject) => {
    let keys = Object.keys(values);
    var rowObject = {};

    let sql = `UPDATE ${table} SET ${keys.map((v) => `${v}=@${v}`)} ${output ? `OUTPUT ${output}` : ``} WHERE id=@id;`;

    let connection = new Connection(config);
    connection.connect();

    const request = new Request(sql, function (err) {
      if (err) {
        return reject(err);
      }
      connection.close();
    });

    request.addParameter("id", TYPES.Int, id);

    for (let key in values) {
      request.addParameter(key, values[key].type, values[key].value);
    }

    request.on("row", function (columns) {
      columns.forEach(function (column) {
        rowObject[column.metadata.colName] = column.value;
      });
    });

    request.on("doneProc", function (rowCount, more, returnStatus, rows) {
      return resolve(rowObject);
    });

    connection.on("connect", function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      connection.execSql(request);
    });
  });
}

export function remove(table: String, id: Number) {
  return new Promise((resolve, reject) => {
    var rowObject = {};

    let sql = `DELETE FROM ${table} WHERE id=@id`;

    let connection = new Connection(config);
    connection.connect();

    const request = new Request(sql, function (err) {
      if (err) {
        return reject(err);
      }
      connection.close();
    });

    request.addParameter("id", TYPES.Int, id);

    request.on("row", function (columns) {
      columns.forEach(function (column) {
        rowObject[column.metadata.colName] = column.value;
      });
    });

    request.on("doneInProc", function (rowCount, more, rows) {
      return resolve(rowCount);
    });

    connection.on("connect", function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      connection.execSql(request);
    });
  });
}
