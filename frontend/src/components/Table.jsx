import { useEffect, useState } from "react";
import axios from "axios";
import AddListForm from "./Form.jsx";
import Loading from "./Loading.jsx";

const noneDoStyle = {
  backgroundColor: "rgb(228, 228, 228)",
  color: "#000000",
};

const BULAN_IND = {
  Jan: "Jan",
  Feb: "Feb",
  Mar: "Mar",
  Apr: "Apr",
  May: "Mei",
  Jun: "Juni",
  Jul: "Juli",
  Aug: "Agust",
  Sep: "Sept",
  Oct: "Okt",
  Nov: "Nov",
  Dec: "Des",
};

const HARI_IND = {
  Mon: "Senin",
  Tue: "Selasa",
  Wed: "Rabu",
  Thu: "Kamis",
  Fri: "Jum'at",
  Sat: "Sabtu",
  Sun: "Minggu",
};

function translateDate(date) {
  date = date.split(" ");
  const Tanggal = [date[2]];
  const Bulan = [date[1]];
  const Hari = [date[0]];
  const Tahun = [date[3]];

  const result = `${HARI_IND[Hari]}, ${Tanggal} ${BULAN_IND[Bulan]} ${Tahun}`;

  return result;
}

export default function Table() {
  const [jadwal, updateJadwal] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const showDatas = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="4" style={noneDoStyle}>
            <Loading />
          </td>
        </tr>
      );
    } else if (!jadwal.length) {
      return (
        <tr>
          <td colSpan="4" style={noneDoStyle}>
            Tidak ada kegiatan...
          </td>
        </tr>
      );
    }

    const HARI_INI = new Date().toDateString();

    return jadwal.map((e, i) => (
      <tr key={i}>
        <td style={{ fontWeight: "bold" }}>{i + 1}</td>
        <td>{e.kegiatan}</td>
        <td>
          {HARI_INI == new Date(e.tanggal).toDateString() ? (
            <span style={{ color: "rgb(255,0,0)", fontWeight: "bold" }}>
              Hari Ini! 😁
            </span>
          ) : (
            translateDate(new Date(e.tanggal).toDateString())
          )}
        </td>
        <td>
          <i
            onClick={(el) => removeAnimate(el, e._id)}
            className="fa-solid fa-trash fa-xl remove-btn"
          ></i>
        </td>
      </tr>
    ));
  };

  async function updateDatas() {
    try {
      let { data } = await axios.get("http://localhost:9000/api/");

      const HARI_INI = Date.parse(new Date().toDateString());

      data = data.map((el) => {
        el["tanggal"] = Date.parse(el.tanggal);
        return el;
      });

      data = data.sort((a, b) => a.tanggal - b.tanggal);

      const listOfExp = data.filter(
        (el) => Date.parse(new Date(el.tanggal).toDateString()) < HARI_INI
      );

      for (const exp of listOfExp) {
        removeList(exp._id);
      }

      updateJadwal(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  async function removeList(id) {
    const opt = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      data: `id=${id}`,
    };

    const { data } = await axios.delete(
      "http://localhost:9000/api/remove/",
      opt
    );

    if (!data.status) {
      alert("Ada yang tidak Beres");
    }

    updateDatas();
  }

  async function removeAnimate({ target }, id) {
    const row = target.parentElement.parentElement;

    row.classList.add("removed");

    row.addEventListener("animationend", async () => {
      await removeList(id);
      await updateDatas();

      row.classList.remove("removed");
    });
  }

  useEffect(() => {
    updateDatas();
  }, []);

  return (
    <>
      <AddListForm updateData={updateDatas} />
      <table>
        <thead>
          <tr>
            <th width="1rem">No.</th>
            <th width="60%">Kegiatan</th>
            <th>Tanggal</th>
            <th width="1rem"></th>
          </tr>
        </thead>
        <tbody>{showDatas()}</tbody>
      </table>
    </>
  );
}
