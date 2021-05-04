import express, { json } from "express";
import robotsNoIndex from "./middleware/robotsNoIndex";
import apiRoute from "./routes/api/api";

const app = express();

app.use(json());
app.use(robotsNoIndex);
app.disable("x-powered-by");

app.use("/api", apiRoute);

let port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
