import express from "express";
import { addJadwal, getJadwal, deleteJadwal } from "./controller.js";

const route = express.Router();

/* 
!IMPORTANT semua request harus berbentuk form encoded tidak ada json

* untuk 'add' parameter yang harus ada dalam request antara lain: kegiatan & tanggal
* untuk 'remove' parameter yang harus ada hanya 'id' jadwalnya saja

* untuk respon, akan me-return obj dengan prop status "1" jika ok dan "0" sebaliknya

* Happy Code 😉

? Sould i add a update one?
*/

express().set("view engine", "ejs");

route.get("/", getJadwal);
route.post("/add/", addJadwal);
route.delete("/remove/", deleteJadwal);
// route.patch("/edit/", editJadwal);

route.use("/", (req, res) => {
  const reqDir = req.path;

  res.status(404);
  res.render("404", { reqDir });
});

export default route;
