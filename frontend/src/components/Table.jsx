import { useEffect, useState } from "react";
import axios from "axios";
import AddListForm from "./Form.jsx";

export default function Table() {
  const [jadwal, updateJadwal] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const noneDoStyle = {
    backgroundColor: "rgb(43, 43, 43)",
    color: "#ffffff",
  };

  const showDatas = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="4" style={noneDoStyle}>
            Loading...
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
        <td>{e.tanggal}</td>
        <td>
          <button onClick={() => remove(e._id)} className="btn danger-btn">
            Remove
          </button>
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

  async function remove(id) {
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

  useEffect(() => {
    updateDatas();
  }, []);

  return (
    <>
      <AddListForm update={updateDatas} />
      <table>
        <thead>
          <tr>
            <th width="3rem">No.</th>
            <th>Kegiatan</th>
            <th width="150rem">Tanggal</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>{showDatas()}</tbody>
      </table>
    </>
  );
}
