import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import Axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();

  const handlebtn = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const [cityname, setCityname] = useState("");
  const [vcentres, setVcentres] = useState("");
  const [slot, setSlot] = useState("");
  const [dosagelist, setDosagelist] = useState([]);
  const [vcentresList, setVcentresList] = useState([]);
  const [cnameList, setCnameList] = useState([]);
  const [bookingsuccess, setbookingsuccess] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:5001/data/getinsertdetails")
      .then((response) => {
        console.log("Data from server:", response.data);
        setDosagelist(response.data);
        const centresList = Array.from(
          new Set(response.data.map((item) => item.vcentres))
        );
        const cityList = Array.from(
          new Set(response.data.map((item) => item.cityname))
        );
        console.log("Vaccination Centres List:", centresList);
        console.log("city  List:", cityList);
        setVcentresList(centresList);
        console.log(vcentresList);
        setCnameList(cityList);
        console.log(cnameList);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const bookSlot = (selectedvcentres) => {
    if (!cityname || !selectedvcentres || !slot) {
      alert("Please fill in all fields");
      return;
    }

    const selectedCenter = dosagelist.find(
      (item) => item.vcentres === selectedvcentres
    );

    if (selectedCenter && parseInt(slot, 10) > selectedCenter.slot) {
      alert(
        "Provide a valid slot. The requested slots exceed the available slots."
      );
      return;
    }

    Axios.post("http://localhost:5001/bookslot", {
      cityname,
      vcentres,
      slot,
    })
      .then((response) => {
        console.log("Slot booked successfully:", response.data);

        setDosagelist((prevDosagelist) =>
          prevDosagelist?.map((item) =>
            item.vcentres === vcentres
              ? { ...item, slot: item.slot - slot }
              : item
          )
        );

        setbookingsuccess(true);

        setCityname("");
        setVcentres("");
        setSlot("");
      })
      .catch((error) => {
        console.error("Error booking slot:", error);
      });
  };

  return (
    <section className="auth-section">
      <div className="auth-container-2">
        <h1>Book a slot</h1>
        <form>
          <div>
            <label htmlFor="name">
              <h3>City Name</h3>
              <select
                id="name"
                name="name"
                value={cityname}
                style={{ height: "30px", width: "100%" }}
                onChange={(e) => setCityname(e.target.value)}
                required
              >
                <option value="">Select a city name</option>
                {cnameList.map((cityname, index) => (
                  <option key={index} value={cityname}>
                    {cityname}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="centres">
              <h3>Vaccination centres</h3>
              <select
                id="centres"
                name="centres"
                value={vcentres}
                style={{ height: "30px", width: "100%" }}
                // onClick={loadVcentresList}
                onChange={(e) => setVcentres(e.target.value)}
                required
              >
                <option value="">Select a vaccination centre</option>
                {vcentresList.map((vcentres, index) => (
                  <option key={index} value={vcentres}>
                    {vcentres}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="slots">
              <h4>No of slots</h4>
              <input
                type="number"
                id="slots"
                value={slot}
                name="slots"
                placeholder="No of slot"
                style={{ height: "30px" }}
                onChange={(e) => {
                  setSlot(e.target.value);
                }}
                required
              />
            </label>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button type="button" className="auth-btn" onClick={bookSlot}>
              Book a slot
            </button>
            <button
              type="submit"
              className="handle-switch-btn"
              onClick={handlebtn}
            >
              Logout
            </button>
          </div>
          <div>
            <div className="details-table-container">
              {bookingsuccess && (
                <p style={{ color: "blue" }}>Slot booked successfully!</p>
              )}
              <h2>Details Table</h2>
              <table className="details-table">
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Vaccination Centre</th>
                    <th>No of slots</th>
                  </tr>
                </thead>
                <tbody>
                  {dosagelist?.map((val, id) => {
                    return (
                      <tr key={id}>
                        <td>{val.cityname}</td>
                        <td>{val.vcentres}</td>
                        <td>{val.slot}</td>
                        {/* <input type="text" className="Updateinput" />
                                  <button className="button">Update Details</button> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default HomePage;
