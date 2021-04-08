const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "Acesso negado." });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return res
            .status(401)
            .json({ error: "Sessão expirada, faça login novamente!" });

        case "JsonWebTokenError":
          return res
            .status(401)
            .json({ error: "Token inválido, faça login novamente" });

        default:
          return res
            .status(500)
            .json({ auth: false, message: "Falha ao autenticar token." });
      }
    }

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
};
