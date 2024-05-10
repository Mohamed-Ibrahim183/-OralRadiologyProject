import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Navbar from "../../Components/Navbar/Navbar";
import AssignmentCard from "./AssignmentCard";
import Chart from "./Chart";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ProfessorDB.css";
import "./professor.css";
import Modal2 from "./Modal2";
import { Navigate } from "react-router-dom";

import axios from "axios";

const ProfessorDB = () => {
  const professorName = sessionStorage["Name"] || "Professor";
  const professorImage = sessionStorage["PersonalImage"];
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModal2Open, setModal2Open] = useState(false);
  const [assignments, setAssignments] = useState([]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  // const handleOpenModal2 = () => setModal2Open(true);
  const handleCloseModal2 = () => setModal2Open(false);

  useEffect(() => {
    axios
      .get("http://localhost/Projects/OralRadiology/AssignmentLogic.php/GetAll")
      .then((res) => {
        console.log(res.data);
        setAssignments(res.data);
      })
      .catch((error) => console.error(error));
  }, []);
  if (sessionStorage["Type"] !== "Professor") {
    return <Navigate to="/" />;
  }

  // console.log("assignments:", assignments);
  return (
    <>
      <Navbar />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}></Modal>
      {/* <Modal2 open={isModal2Open} onClose={handleCloseModal2} /> */}
      <div className="fullProfessorPage">
        <div className="upper">
          <div className="container AssignmentSection">
            <div className="BBBBBB">
              <h2 className="sectionTitle">My Assignments</h2>
              {/* Added onClick event handler */}
              <button className="" onClick={handleOpenModal}>
                Add Requirement
              </button>{" "}
            </div>
            <div className="cardAssignment">
              {assignments.map((assignment, index) => (
                <AssignmentCard
                  key={index}
                  name={assignment.Name}
                  info={`${assignment.Topic}, April 30, 2024, 1:00 pm`}
                  AssignmentId={assignment.Id}
                />
              ))}
            </div>
            <h5 className="seal">See all →</h5>
          </div>
          <div className="userProfile">
            <div className="TEXT">
              <img
                src={professorImage}
                alt="Professor Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "20px",
                  marginTop: "-20px",
                  marginBottom: "20px",
                }}
              />

              <h4>Welcome Back</h4>
              <h2>Dr. {professorName}</h2>
              <p>Welcome to our Oral Radiology system</p>
            </div>
            <button type="button" className="">
              Go To Profile
            </button>
          </div>
        </div>
        <div className="lower">
          <div className="cc1">
            <Chart className="chart1" />
          </div>
          <div className="calender">
            <h2>Calendar</h2>
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessorDB;
