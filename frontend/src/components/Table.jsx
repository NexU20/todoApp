import { useEffect, useState } from "react";
import axios from "axios";
import AddListForm from "./Form.jsx";
import Loading from "./Loading.jsx";

const noneDoStyle = {
  backgroundColor: "rgb(228, 228, 228)",
  color: "#000000",
};

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

    return jadwal.map((e, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{e.kegiatan}</td>
        <td>{new Date(e.tanggal).toDateString()}</td>
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
      const { data } = await axios.get("http://localhost:9000/api/");
      updateJadwal(data);
    } catch (err) {
      console.log("Ada yang tidak beres..");
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
            <th>Kegiatan</th>
            <th width="150rem">Tanggal</th>
            <th width="2rem">Remove</th>
          </tr>
        </thead>
        <tbody>{showDatas()}</tbody>
      </table>
    </>
  );
}
