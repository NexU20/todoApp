import writeData from "./write-jadwal.js";
import * as fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.DB_URI);
await client.connect();

const db = client.db("explore");
const collection = db.collection("todo-lists");

// * read jadwal from data.json
const readJadwalData = () => {
  let data = fs.readFileSync("./data.json");
  data = JSON.parse(data);

  return data;
};

export async function getJadwal(req, res) {
  const json = await collection.find().toArray();

  res.json(json);
}

export async function addJadwal(req, res) {
  const { kegiatan, tanggal } = req.body;

  const obj = {
    kegiatan,
    tanggal,
  };

  const respon = await collection.insertOne(obj);

  let stat = { status: 1 };

  if (!respon.acknowledged) {
    stat.status = 0;
    res.status(404).json(stat);
  }

  res.json(stat);
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

export async function editJadwal(req, res) {
  const ID = req.body.id;
  const kegiatan = req.body.kegiatan;
  const tanggal = req.body.tanggal;

  let data = readJadwalData();

  let item = data.find((e) => e.id == ID);
  item.kegiatan = kegiatan;
  item.tanggal = tanggal;

  const respon = writeData(data);

  if (respon == "err") {
    res.status(404);
  }

  res.send("OK");
}
