import { useState } from "react";
import axios from "axios";

export default function AddListForm({ update }) {
  const [tanggal, setTanggal] = useState("");
  const [kegiatan, setKegiatan] = useState("");

  async function addData(e) {
    e.preventDefault();

    const opt = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    };

    if (tanggal == "" || kegiatan == "") {
      alert("Tanggal dan Kegiatan harus diisi dulu Maniezz!");
      return;
    }

    const inp = {
      kegiatan,
      tanggal,
    };

    const { data } = await axios.post(
      "http://localhost:9000/api/add/",
      inp,
      opt
    );

    if (!data.status) {
      alert("Gagal. Sepertinya ada yang tidak beres");
    }

    update();

    setKegiatan("");
    setTanggal("");
  }

  return (
    <form autoComplete="off" id="add-kegiatan" onSubmit={(e) => addData(e)}>
      <div className="input">
        <label htmlFor="do">Kegiatan:</label>
        <input
          type="text"
          name="kegiatan"
          id="do"
          placeholder="Isi Kegiatan..."
          onChange={(e) => setKegiatan(e.target.value)}
          value={kegiatan}
          required
        />
      </div>

      <div className="input">
        <label htmlFor="tgl">Kegiatan:</label>
        <input
          type="text"
          name="tanggal"
          id="tgl"
          placeholder="Tanggal Berapa?..."
          onChange={(e) => setTanggal(e.target.value)}
          value={tanggal}
          required
        />
      </div>
      <button type="submit" id="add" className="btn green-btn">
        Tambah
      </button>
    </form>
  );
}
