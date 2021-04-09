const employeeRepository = require("../repository/employeeRepository");

//GET
exports.getEmployees = (req, res) => {
  employeeRepository
    .getEmployees()
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.getEmployeeById = (req, res) => {
  let { params } = req;

  employeeRepository
    .getEmployeeById(params.id)
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

exports.getEmployeeTeamsById = (req, res) => {
  let { params } = req;

  employeeRepository
    .getEmployeeTeamsById(params.id)
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

//POST
exports.postEmployee = (req, res) => {
  const { body } = req;
  employeeRepository
    .addEmployee(body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

//PUT
exports.putEmployeeById = (req, res) => {
  const { body } = req;

  employeeRepository
    .updateEmployee(body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

exports.putEmployeeTeamsById = (req, res) => {
  const { params, body } = req;

  employeeRepository
    .putEmployeeTeamsById(body, params.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};

//DELETE
exports.deleteEmployeeById = (req, res) => {
  const { params } = req;

  employeeRepository
    .deleteEmployeeById(params.id)
    .then((result) => {
      res.sendStatus(result ? 200 : 404);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
};
