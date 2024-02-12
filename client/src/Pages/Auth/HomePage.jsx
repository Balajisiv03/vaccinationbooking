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
  const [bookingsuccess, setbookingsuccess] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:5001/data/getinsertdetails")
      .then((response) => {
        console.log("Data from server:", response.data);
        setDosagelist(response.data);
        const centresList = Array.from(
          new Set(response.data.map((item) => item.vcentres))
        );
        console.log("Vaccination Centres List:", centresList);
        setVcentresList(centresList);
        console.log(vcentresList);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // const loadVcentresList = () => {
  //   // Fetch the list of vaccination centers only when the dropdown is clicked
  //   const centresList = Array.from(
  //     new Set(dosagelist.map((item) => item.vcentres))
  //   );
  //   console.log("Vaccination Centres List:", centresList);
  //   setVcentresList(centresList);
  // };

  // Function to handle slot booking
  const bookSlot = (selectedvcentres) => {
    if (!cityname || !selectedvcentres || !slot) {
      alert("Please fill in all fields");
      return;
    }

    //  a POST request to book the slot
    Axios.post("http://localhost:5001/bookslot", {
      cityname,
      vcentres,
      slot,
    })
      .then((response) => {
        console.log("Slot booked successfully:", response.data);

        // Update the dosagelist after successful booking
        setDosagelist((prevDosagelist) =>
          prevDosagelist.map((item) =>
            item.vcentres === vcentres
              ? { ...item, slot: item.slot - slot } // Decrease the slot count for the booked center
              : item
          )
        );

        setbookingsuccess(true);

        // Clear the input fields
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
              <h4>City Name</h4>
              <input
                type="text"
                id="name"
                value={cityname}
                name="name"
                placeholder="Enter city name"
                style={{ height: "30px" }}
                onChange={(e) => {
                  setCityname(e.target.value);
                }}
                required
              />
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
