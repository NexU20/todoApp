import { useState, useRef } from "react";
import axios from "axios";

export default function AddListForm({ updateData }) {
  const [tanggal, setTanggal] = useState("");
  const [kegiatan, setKegiatan] = useState("");
  const spanInp = useRef();
  const inpText = useRef();
  const formHead = useRef();

  function inpAnimateIn() {
    spanInp.current.style.translate = "0 -25px";
    spanInp.current.style.zIndex = "2";
    spanInp.current.style.transform = "scale(0.9)";

    inpText.current.style.borderColor = "green";
  }

  function inpAnimateOut() {
    spanInp.current.style.translate = "0 0";
    spanInp.current.style.zIndex = "-1";
    spanInp.current.style.transform = "scale(1)";

    inpText.current.style.borderColor = "#4d4c4c";
  }

  function inpBlurHandle() {
    if (!kegiatan) {
      inpAnimateOut();
    }
  }

  async function addData(e) {
    e.preventDefault();

    const HARI_INI = Date.parse(new Date().toDateString());

    const opt = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    };

    if (tanggal == "" || kegiatan == "") {
      alert("Tanggal dan Kegiatan harus diisi dulu!");
      return;
    } else if (Date.parse(tanggal) < HARI_INI) {
      alert("Udah Lewat Maniezz 🥰");
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

    updateData();

    setKegiatan("");
    setTanggal("");

    inpAnimateOut();
  }

  return (
    <form autoComplete="off" id="add-kegiatan" onSubmit={(e) => addData(e)}>
      <div id="form-head" ref={formHead}>
        <h1>Tambah Kegiatan</h1>
      </div>
      <br />
      <div className="input">
        <span ref={spanInp}>
          <label htmlFor="do">Isi Kegiatan</label>
        </span>
        <input
          ref={inpText}
          onFocus={() => inpAnimateIn()}
          onBlur={() => inpBlurHandle()}
          type="text"
          name="kegiatan"
          id="do"
          onChange={(e) => setKegiatan(e.target.value)}
          value={kegiatan}
          required
        />
      </div>

      <div className="input">
        <label htmlFor="tgl">Tanggal:</label>
        <input
          type="date"
          name="tanggal"
          id="tgl"
          placeholder="Tanggal Berapa?..."
          onInput={(e) => setTanggal(e.target.value)}
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
