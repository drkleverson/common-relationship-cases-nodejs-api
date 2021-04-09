const { TABLES, FK } = require("../db/consts");
const db = require("../db/connection");
const { TYPES } = require("tedious");

//GET
exports.getProviders = (req, res) => {
  async function response() {
    let sql = `SELECT NOME FROM ${TABLES.PROVIDERS} ORDER BY ID`;
    let providers = await db.rawQuery(sql);
    return { data: providers };
  }

  response()
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.getProvidersById = (req, res) => {
  const { params } = req;

  async function response() {
    let sql = `SELECT NOME FROM ${TABLES.PROVIDERS} WHERE ID = ${params.id}`;
    let provider = await db.rawQuery(sql);

    if (!provider.length) {
      return false;
    }

    return { data: provider };
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
