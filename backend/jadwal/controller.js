import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";
import { validateDate } from "./utills.js";

dotenv.config();

const client = new MongoClient(process.env.DB_URI);
await client.connect();

const db = client.db("explore");
const collection = db.collection("todo-lists");

export async function getJadwal(req, res) {
  const json = await collection.find().toArray();

  res.json(json);
}

export async function addJadwal(req, res) {
  let { kegiatan, tanggal } = req.body;

  let stat = { status: 1 };

  const isDate = validateDate(tanggal);

  if (!isDate) {
    stat.status == 0;
    res.status(400).json(stat);
  } else {
    const obj = {
      kegiatan,
      tanggal: new Date(tanggal),
    };

    const respon = await collection.insertOne(obj);

    if (!respon.acknowledged) {
      stat.status = 0;
      res.status(400).json(stat);
    }

    res.json(stat);
  }
}

export async function deleteJadwal(req, res) {
  const { id } = req.body;

  const data = {
    _id: new ObjectId(id),
  };

  const respon = await collection.deleteOne(data);

  let stat = { status: 1 };

  if (!respon.acknowledged) {
    stat.status = 0;
    res.status(404).json(stat);
  }

  res.json(stat);
}

// export async function editJadwal(req, res) {
//   const ID = req.body.id;
//   const kegiatan = req.body.kegiatan;
//   const tanggal = req.body.tanggal;

//   let data = readJadwalData();

//   let item = data.find((e) => e.id == ID);
//   item.kegiatan = kegiatan;
//   item.tanggal = tanggal;

//   const respon = writeData(data);

//   if (respon == "err") {
//     res.status(404);
//   }

//   res.send("OK");
// }
