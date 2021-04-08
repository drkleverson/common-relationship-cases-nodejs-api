const { TYPES, Connection, Request } = require("tedious");
require("dotenv").config();

var config = {
  server: process.env.DB_HOST,
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
  options: {
    port: parseInt(process.env.DB_PORT),
    trustServerCertificate: true,
    rowCollectionOnDone: true,
    validateBulkLoadParameters: false,
    encrypt: false,
    database: process.env.DB_DATABASE,
  },
};
// If no error, then good to proceed.
module.exports = {
  rawQuery: async (sql) => {
    return await new Promise((resolve, reject) => {
      var jsonArray = [];
      let connection = new Connection(config);
      connection.connect();

      request = new Request(sql, function (err, rowCount, rows) {
        if (err) {
          return reject(err);
        }
        connection.close();
      });

      request.on("row", function (columns) {
        var rowObject = {};

        columns.forEach(function (column) {
          rowObject[column.metadata.colName] = column.value;
        });
        jsonArray.push(rowObject);
      });

      request.on("doneInProc", function (rowCount, more, returnStatus, rows) {
        return resolve(jsonArray);
      });

      connection.on("connect", function (err) {
        if (err) {
          process.exit(1);
        }
        connection.execSql(request);
      });
    });
  },
  insert: async (table, values, output = null) => {
    return await new Promise((resolve, reject) => {
      let keys = Object.keys(values);
      var rowObject = {};

      let sql = `INSERT ${table} (${keys.join(",")}) ${
        output ? `OUTPUT ${output}` : ``
      } VALUES (${keys.map((v) => `@${v}`).join(",")});`;

      let connection = new Connection(config);
      connection.connect();

      request = new Request(sql, function (err) {
        if (err) {
          return reject(err);
        }
        connection.close();
      });

      for (key in values) {
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
  },
  update: async (table, id, values, output = false) => {
    return await new Promise((resolve, reject) => {
      let keys = Object.keys(values);
      var rowObject = {};

      let sql = `UPDATE ${table} SET ${keys.map((v) => `${v}=@${v}`)} ${
        output ? `OUTPUT ${output}` : ``
      } WHERE id=@id;`;

      let connection = new Connection(config);
      connection.connect();

      request = new Request(sql, function (err) {
        if (err) {
          return reject(err);
        }
        connection.close();
      });

      request.addParameter("id", TYPES.Int, parseInt(id));

      for (key in values) {
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
  },
  delete: async (table, id) => {
    return await new Promise((resolve, reject) => {
      var rowObject = {};

      let sql = `DELETE FROM ${table} WHERE id=@id`;

      let connection = new Connection(config);
      connection.connect();

      request = new Request(sql, function (err) {
        if (err) {
          return reject(err);
        }
        connection.close();
      });

      request.addParameter("id", TYPES.Int, parseInt(id));

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
  },
};
