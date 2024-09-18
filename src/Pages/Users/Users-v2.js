import React, { useEffect, useReducer, useState } from "react";
import "./users2.css";
import { Navigate } from "react-router-dom";
import BasicModal from "./Edit";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Typography,
} from "@mui/material";
import { Cancel, Delete } from "@mui/icons-material";
import BasicModalComp from "../../Components/BasicModal/BasicModalComp";
import {
  changeUserGroup,
  deleteUserFromDB,
  getUsersOfType,
} from "../../Slices/AdminSlice";
import { resetPassword, serverURL } from "../../Slices/GeneralSlice";
import toast from "react-hot-toast";

const initialState = { users: [], render: 0, type: "Student" };
const Users = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  function reducer(state, action) {
    switch (action.type) {
      default:
        return { ...state, render: state.render + 1 };
    }
  }
  const [open, setOpen] = useState(false);
  const [clickedUser, setClickedUser] = useState();
  const [view, setView] = useState([]);
  const [Type, setType] = useState("Student");
  const [changes, setChanges] = useState([]);
  const [beforeSubmitModal, setBeforeSubmitModal] = useState(false);
  const [render, setRender] = useState(1);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [resetPass, setResetPass] = useState(false);
  const [resetUser, setResetUser] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setBeforeSubmitModal(false);
  };

  useEffect(() => {
    document.body.classList.add("TableBody");

    return () => document.body.classList.remove("TableBody");
  }, []);

  function FrontView(dataContent) {
    const content = dataContent.map((ele) => (
      <tr key={ele.Id}>
        <td>{ele.Id}</td>
        <td>
          <Avatar
            src={serverURL + ele.PersonalImage}
            alt={ele.Name}
            sx={{
              m: "auto",
              width: "75px",
              height: "75px",
              objectFit: "cover",
            }}
          />
        </td>
        <td>{ele.Name}</td>
        <td>{ele.MSAId}</td>
        <td>{ele.Type}</td>
        <td>{ele.Email}</td>
        <td>{ele.Group}</td>
        <td className="select">
          <button
            className="button edit"
            onClick={() => {
              setClickedUser(ele);
              setOpen(true);
            }}
          >
            Change Group
          </button>
          <button
            className="button del"
            onClick={() => {
              setDeleteUser(ele);
              setDeleteModal(true);
            }}
          >
            Delete
          </button>
          <button
            className="button edit"
            onClick={() => {
              setResetPass(true);
              setResetUser(ele);
            }}
          >
            Reset Password
          </button>
        </td>
      </tr>
    ));
    setView(content);
  }

  function handleSaveChanges2() {
    if (!changes) return;
    let fData = new FormData();
    Object.keys(changes).forEach((ele) => {
      fData.append(ele, changes[ele].Group);
    });
    changeUserGroup(fData).then((res) => {
      console.log(res.msg);
      setBeforeSubmitModal(false);
      setRender(render + 1);
      setChanges([]);
    });
  }

  useEffect(() => {
    getUsersOfType(Type).then((res) =>
      res.msg !== "" ? FrontView(res.msg) : null
    );
  }, [Type, render]);

  if (sessionStorage["Type"] !== "Admin") {
    return <Navigate to="/" />;
  }

  const finalModal = () => (
    <BasicModalComp
      openModal={beforeSubmitModal}
      closeModal={() => setBeforeSubmitModal(false)}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">To Group</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(changes).map((key) => (
              <TableRow key={key}>
                <TableCell align="center">{key}</TableCell>
                <TableCell align="center">
                  <Avatar
                    src={serverURL + changes[key].Image}
                    alt={changes[key].Name}
                    sx={{
                      m: "auto",
                      width: "75px",
                      height: "75px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell align="center">{changes[key].Name}</TableCell>
                <TableCell align="center">{changes[key].Group}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSaveChanges2()}
      >
        Submit Changes
      </Button>
    </BasicModalComp>
  );

  function deleteUserDB(userId) {
    deleteUserFromDB(userId).then((res) => {
      console.log(res.msg);
      setDeleteModal(false);
      setRender((prevRender) => prevRender + 1);
    });
  }

  const deleteModalContent = () => {
    if (!deleteUser) return;
    return (
      <BasicModalComp
        openModal={deleteModal}
        closeModal={() => setDeleteModal(false)}
      >
        <Typography variant="h6" component="h3">
          Are You Sure You Want to Delete this User?
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Avatar
            src={serverURL + deleteUser.PersonalImage}
            alt={deleteUser.Name}
            sx={{ width: 80, height: 80, objectFit: "cover" }}
          />
          <Typography variant="body1" color="initial" sx={{ mx: 2 }}>
            {deleteUser.Name}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="warning"
            endIcon={<Cancel />}
            onClick={() => {
              setDeleteUser(null);
              setDeleteModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<Delete />}
            onClick={() => deleteUserDB(deleteUser.Id)}
          >
            Delete
          </Button>
        </Box>
      </BasicModalComp>
    );
  };

  return (
    <>
      {finalModal()}
      {deleteModalContent()}
      {resetPass && (
        <BasicModalComp
          openModal={resetPass}
          closeModal={() => setResetPass(false)}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              m: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" color="inherit">
                Are you Want to Reset Password For User:
                <Typography
                  variant="body1"
                  color="inherit"
                  sx={{ display: "flex", alignItems: "center", m: 2 }}
                >
                  {resetUser.Name}
                  <Avatar
                    src={serverURL + resetUser.PersonalImage}
                    alt={resetUser.Name}
                    sx={{
                      m: "auto",
                      width: "75px",
                      height: "75px",
                      objectFit: "cover",
                    }}
                  />
                </Typography>
              </Typography>
            </Box>

            <Box
              sx={{
                my: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Button
                variant="contained"
                color="warning"
                endIcon={<Cancel />}
                onClick={() => {
                  setResetUser(null);
                  resetPass(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                // endIcon={<Delete />}
                onClick={() => {
                  resetPassword(resetUser.Id);
                  toast(
                    `USER: ${resetUser.Name} Has Reset The Password to "pass" Successfully!`,
                    {
                      type: "success",
                    }
                  );
                  setResetUser(null);
                  setResetPass(false);
                }}
              >
                Reset Password
              </Button>
            </Box>
            <Typography variant="body1" color="inherit">
              Note: Password will reset to be "pass"
            </Typography>
          </Box>
        </BasicModalComp>
      )}
      <BasicModal
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        selectedUser={clickedUser}
        setChanges={setChanges}
      />
      <div className="Table">
        <select
          className="select"
          name="Type"
          id="Type"
          onChange={(e) => setType(e.target.value)}
          value={Type}
        >
          <option value="Student">Student</option>
          <option value="Professor">Professor</option>
          <option value="Admin">Admin</option>
        </select>
        <h1>Users</h1>
        <main>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>MSA ID</th>
                <th>Type</th>
                <th>Email</th>
                <th>Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th colSpan="7">Spring 24</th>
              </tr>
            </tfoot>
            <tbody>{view}</tbody>
          </table>
        </main>
        <Button
          sx={{ mb: 5 }}
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            if (!changes) return;
            setBeforeSubmitModal(true);
          }}
        >
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default Users;
