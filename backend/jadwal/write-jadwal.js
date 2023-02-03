import { writeFile } from "node:fs/promises";

export default async function writeData(data) {
  const obj = JSON.stringify(data);

  try {
    await writeFile("./data.json", obj);
    return "OK";
  } catch (err) {
    return "err";
  }
}
