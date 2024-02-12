import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import Axios from "axios";
const AdmPage = () => {
  const navigate = useNavigate();

  const handlebtn = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  const [cityname, setCityname] = useState("");
  const [vcentres, setVcentres] = useState("");
  const [slot, setSlot] = useState("");
  const [dosagelist, setDosagelist] = useState([]);
  const [showdetails, setShowdetails] = useState(false);

  //message notification
  const [adddetails, setadddetails] = useState(false);
  const [deletemsg, setdeletemsg] = useState(false);

  function showlist() {
    if (!showdetails) {
      Axios.get("http://localhost:5001/data/getinsertdetails").then(
        (response) => {
          setDosagelist(response.data);
          console.log("Data :", response);
        }
      );
    } else {
      setDosagelist([]);
    }
    setShowdetails(!showdetails);
    console.log("check");
  }

  function deletedetail(vcentres) {
    Axios.delete(`http://localhost:5001/data/deletedetail/${vcentres}`)
      .then((response) => {
        setDosagelist(
          dosagelist.filter((val) => {
            return val.vcentres !== vcentres;
          })
        );
        console.log(response.data);
        setdeletemsg(true);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        console.error("Status Code:", error.response.status);
      });
  }

  const Submitadmdata = (e) => {
    e.preventDefault();
    if (!cityname || !vcentres || !slot) {
      alert("Please fill in all fields");
      return;
    }
    console.log("Form data:", { cityname, vcentres, slot });

    Axios.post("http://localhost:5001/data/insertdetails", {
      cityname,
      vcentres,
      slot,
    })
      .then((response) => {
        console.log("Insert successful:", response.data);
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });

    setadddetails(true);
  };

  return (
    <>
      <section className="auth-section">
        <div className="auth-container-2">
          <h1>Admin Page</h1>
          <form onSubmit={Submitadmdata}>
            <div>
              <label htmlFor="name">
                <h4>City Name</h4>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter city name"
                  style={{ height: "30px" }}
                  onChange={(e) => {
                    setCityname(e.target.value);
                  }}
                />
              </label>
              <label htmlFor="dosdetails">
                <h4>Slots allocated</h4>
                <input
                  type="number"
                  id="dosdetails"
                  name="dosdetails"
                  placeholder="No of slots"
                  style={{ height: "30px" }}
                  onChange={(e) => {
                    setSlot(e.target.value);
                  }}
                />
              </label>
              <label htmlFor="addcentres">
                <h4> Add Vaccination centres</h4>
                <input
                  type="text"
                  id="addcentres"
                  name="addcentres"
                  placeholder="Add centres"
                  style={{ height: "30px" }}
                  onChange={(e) => {
                    setVcentres(e.target.value);
                  }}
                />
                {/* <button type="submit" className="handle-switch-btn" style={{color: "white",backgroundColor:"blue", paddingTop: "10px",
                      paddingBottom:"10px", paddingRight:"10px", paddingLeft:"10px", marginLeft:"10px"}}>Add</button> */}
              </label>
              <button type="submit" className="auth-btn">
                Submit
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            >
              <button
                type="submit"
                onClick={handlebtn}
                className="handle-switch-btn"
              >
                Logout
              </button>
              <button
                type="button"
                className="handle-switch-btn"
                onClick={showlist}
              >
                {showdetails ? "Hide Details" : "Show Details"}
              </button>
            </div>
            <div>
              {adddetails && (
                <p style={{ color: "blue", textAlign: "center" }}>
                  Details added successfully
                </p>
              )}
            </div>
            <div>
              {showdetails && (
                <div className="details-table-container">
                  <h2>Details Table</h2>
                  <table className="details-table">
                    <thead>
                      <tr>
                        <th>City</th>
                        <th>Vaccination Centre</th>
                        <th>No of slots</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dosagelist.map((val, id) => {
                        return (
                          <tr key={id}>
                            <td>{val.cityname}</td>
                            <td>{val.vcentres}</td>
                            <td>{val.slot} </td>
                            <td>
                              <button
                                type="button"
                                className="handle-switch-btn"
                                onClick={(vcentres) => {
                                  deletedetail(val.vcentres);
                                }}
                              >
                                Delete record
                              </button>
                            </td>

                            {/* <input type="text" className="Updateinput" />
                                      <button className="button">Update Details</button> */}
                          </tr>
                        );
                      })}
                      <div>
                        {deletemsg && (
                          <p style={{ color: "blue", textAlign: "center" }}>
                            Centre deleted successfully
                          </p>
                        )}
                      </div>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AdmPage;
