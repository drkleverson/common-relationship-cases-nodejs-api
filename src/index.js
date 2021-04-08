var express = require("express");

const app = express();

const robotsNoIndex = require("./middleware/robotsNoIndex");

const apiRoute = require("./routes/api/api");

app.use(express.json());
app.use(robotsNoIndex);

app.use("/api", apiRoute);

app.listen(process.env.PORT || 3000, () =>
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`
  )
);
