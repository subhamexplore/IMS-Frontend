import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import EwayBill from "./EwayBill";
import { CssBaseline, Container, Paper, Box } from "@material-ui/core";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { Bars } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from "axios";

function StepperBillCode() {
  const [isLoading, setIsLoading] = useState(true);
  const [side, setSide] = useState(false);
  const [navClick, setNavClick] = useState(false);
  const navigation = useNavigate();
  const [open, setOpen] = useState(false);
  const [getOpen, setGetOpen] = useState(false);
  const [irnNumber, setIrnNumber] = useState("");
  const [getCancel, setGetCancel] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  const { state } = useLocation();

  const handleClose = () => {
    setOpen(false);
    setIrnNumber("");
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const crossCheck = localStorage.getItem("cross");
    const expiryCheck = localStorage.getItem("expiryDate");
    if (!crossCheck) {
      if (expiryCheck) {
        navigation("/mpin");
      } else {
        navigation("/");
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCancel = async () => {
    await axios
      .post(`http://localhost:3500/cancel-irn`, {
        irnNumber: irnNumber,
        auth: state,
      })
      .then((res) => {
        console.log(res.data);
        setIrnNumber("");
        setOpen(false);
      })
      .catch((err) => console.error(err));
  };

  const [error, setError] = useState("");

  const handleGet = async () => {
    await axios
      .post(`http://localhost:3500/get-irn`, {
        irnNumber: irnNumber,
        auth: state,
      })
      .then((res) => {
        if (res.data.ErrorDetails) {
          setError(res.data.ErrorDetails[0].ErrorMessage);
        } else {
          navigation("/gst/e-invoice", { state: res.data });
          console.log(res.data);
          setIrnNumber("");
          setOpen(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const [getIRNData, setGetIRNData] = useState([]);

  const handleGetData = async () => {
    await axios
      .get(`http://localhost:3500/all-irn-generated`)
      .then((res) => {
        console.log(res.data);
        setGetIRNData(res.data);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div>
      {isLoading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Bars
            height="80"
            width="80"
            color="#40a1ed"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <>
          {openError ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "30%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Error Messages</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenError(false);
                      setErrorMsg([]);
                    }}
                  />
                </div>

                <div className="row g-3 mt-3 mb-5">
                  <ul>
                    {errorMsg.map((item) => (
                      <li style={{ color: "red" }} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="col-12 text-center mt-3">
                    <span
                      className="text-muted"
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        background: "black",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontWeight: "600",
                      }}
                    >
                      <a
                        onClick={() => {
                          setOpenError(false);
                          setErrorMsg([]);
                        }}
                      >
                        Back
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {open ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "30%", height: "40%" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">
                    {getCancel ? "Get IRN" : "Cancel IRN"}
                  </div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleClose();
                      setError("");
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={irnNumber}
                    placeholder="Enter IRN Number"
                    onChange={(e) => setIrnNumber(e.target.value)}
                  />
                  <p style={{ marginLeft: "10px", color: "red" }}>{error}</p>
                  <div className="col-12 text-center mt-3">
                    <a
                      onClick={getCancel ? handleGet : handleCancel}
                      className="btn btn-lg btn-block btn-danger lift text-uppercase"
                    >
                      {getCancel ? "Get" : "Cancel"}
                    </a>
                  </div>
                  <div className="col-12 text-center mt-3">
                    <span className="text-muted" style={{ cursor: "pointer" }}>
                      <a
                        onClick={() => {
                          handleClose();
                          setError("");
                        }}
                      >
                        Back
                      </a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {getOpen ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "50%", height: "60%", overflowY: "scroll" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">All Generated IRN</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setGetOpen(false);
                    }}
                  />
                </div>
                <hr />
                {getIRNData.map((item, index) => (
                  <div>
                    <p>
                      {" "}
                      <span style={{ fontWeight: "bold" }}>IRN:</span>{" "}
                      {item.Irn}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>AckDt:</span>{" "}
                      {item.AckDt}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>AckNo:</span>{" "}
                      {item.AckNo}
                    </p>
                    <hr />
                  </div>
                ))}

                <div className="col-12 text-center mt-3">
                  <span
                    className="text-muted"
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      bottom: "20px",
                      left: "20px",
                      background: "black",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontWeight: "600",
                    }}
                  >
                    <a
                      onClick={() => {
                        setGetOpen(false);
                      }}
                    >
                      Back
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          <div id="stepper">
            <div className="layout-1">
              <SideBar navClick={navClick} side={side} />
              <div className="wrapper">
                <NavBar
                  navClick={navClick}
                  setNavClick={setNavClick}
                  side={side}
                  setSide={setSide}
                />
                <div className="overlay" style={{ background: "white" }}>
                  <div
                    style={{
                      padding: "20px 40px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "black", fontSize: "20px" }}>
                      E-Way Bill Generate
                    </span>
                  </div>
                  <div>
                    <CssBaseline />
                    <Container component={Box} p={4}>
                      <Paper component={Box} p={3}>
                        <EwayBill
                          state={state}
                          setOpenError={setOpenError}
                          setErrorMsg={setErrorMsg}
                        />
                      </Paper>
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StepperBillCode;
