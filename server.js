import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import jadwalRoutes from "./jadwal/route.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");

app.use("/api/", jadwalRoutes);

app.use("/", (req, res) => {
  const reqDir = req.path;

  res.status(404);
  res.render("404", { reqDir });
});

app.listen(port, () =>
  console.log(`Server is up in  http://localhost:${port}`)
);
