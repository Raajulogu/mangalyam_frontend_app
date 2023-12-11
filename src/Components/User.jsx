import React, { useEffect, useState } from "react";
import Base from "../Base/Base";
import axios from "axios";
import "./User.css";
import { Button, TextField } from "@mui/material";
import asserts from "../assert";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

//Backend URL
const api_url = asserts.backend_url;

const User = () => {
  let [images, setImages] = useState(``);
  let [user, setUser] = useState();
  let [alt, setAlt] = useState("");
  let [loading, setLoading] = useState(null);
  let [loading1, setLoading1] = useState(null);
  let [name, setName] = useState("");
  let [fatherName, setFatherName] = useState("");
  let [motherName, setMotherName] = useState("");
  let [phone, setPhone] = useState("");
  let [city, setCity] = useState("");
  let [education, setEducation] = useState("");
  let [job, setJob] = useState("");
  let [expAge1, setExpAge1] = useState("");
  let [expAge2, setExpAge2] = useState("");
  let [expCity, setExpCity] = useState("");
  let [snackmsg, setSnackmsg] = useState("");
  let [show, setShow] = useState(false);
  let token = localStorage.getItem("token");
  let preset_key = asserts.preset_key;
  let cloud_name = asserts.cloud_name;
  let navigate = useNavigate();

  useEffect(() => {
    //Fetching data
    let fetchAllData = async () => {
      //Get User Data
      try {
        const response = await axios.get(`${api_url}/auth/get-user-data`, {
          headers: {
            "x-auth": token,
          },
        });
        console.log(response.data.user);
        setUser(response.data.user);
        setName(response.data.user.name);
        setFatherName(response.data.user.fatherName);
        setMotherName(response.data.user.motherName);
        setPhone(response.data.user.phone);
        setCity(response.data.user.City);
        setEducation(response.data.user.education);
        setJob(response.data.user.job);
        if (response.data.user.expextations) {
          setExpAge1(response.data.user.expextations.age[0]);
          setExpAge2(response.data.user.expextations.age[1]);
          setExpCity(response.data.user.expextations.City);
        }
        if (response.data.user.image === null) {
          setImages("");
        } else {
          setImages(`${response.data.user.image}`);
        }
        if (response.data.user.gender === "Female") {
          setAlt(
            "https://www.vivahasangamam.in/images/female-pending-approval.png"
          );
        } else {
          setAlt(
            "https://www.vivahasangamam.in/images/male-pending-approval.png"
          );
        }
      } catch (error) {
        console.error("Error In Fetching Data:", error);
      }
    };
    //Calling fetch function
    fetchAllData();
  }, []);

  //Handle Update
  async function handleUpdate() {
    setLoading(1);
    //console.log(user)
    let userData = {
      name,
      phone,
      city: city,
      image: images,
      education,
      job,
      motherName,
      fatherName,
    };
    let token = localStorage.getItem("token");
    try {
      console.log(userData);
      const response = await axios.put(
        `${api_url}/auth/update-user-data`,
        userData,
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg(`Data updated successfully`);
      handleClick();
      setLoading(null);
    } catch (error) {
      console.error("Error updating User:", error);
    }
  }

  //Upload Image to Cloudinary
  async function handleUpload(event) {
    let file = event.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_key);
    try {
      let res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
        formData
      );
      setImages(res.data.secure_url);
    } catch (error) {
      console.error("Cloudinary Error:", error.response.data);
    }
  }
  //Handle Update Expectations
  async function handleUpdateExpectation() {
    setLoading1(1);
    let data = {
      data: {
        age: [Number(expAge1), Number(expAge2)],
        City: expCity,
      },
    };
    try {
      const response = await axios.put(
        `${api_url}/user/update-expectations`,
        data,
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg(`Your Expectation's updated successfully`);
      handleClick();
      setLoading1(null);
    } catch (error) {
      console.error("Error updating User:", error);
    }
  }
  //Handle Delete Account
  async function handleDeleteAccount() {
    try {
      const response = await axios.delete(`${api_url}/auth/delete-user`, {
        headers: {
          "x-auth": token,
        },
      });
      setShow(!show);
      navigate("/login");
    } catch (error) {
      console.error("Error updating User:", error);
    }
  }

  //Snackbar Setup
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Base>
      <div
        className={`user-profile-page-container ${show ? "show-alert" : ""}`}
      >
        <div className={show ? "backdrop_overlay" : "none"}>
          <div className="alert-container">
            <h1>Are you sure to delete your account ?</h1>
            <div className="delete-account-btns">
              <Button variant="contained" onClick={() => handleDeleteAccount()}>
                Yes
              </Button>
              <Button onClick={() => setShow(!show)}>Cancel</Button>
            </div>
          </div>
        </div>
        <div>
          {user && (
            <div className="user-profile-page-box">
              <div>
                <h3 className="user-profile-title">Your Profile</h3>
              </div>
              <br />
              <div className="user-profile-data">
                <div className="user-image-box">
                  <img
                    className="user-image"
                    src={images ? images : alt}
                    alt=""
                  />
                </div>
                <form className="update-form">
                  <TextField
                    name="name"
                    type="name"
                    label="Name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <br />
                  <TextField
                    name="Father"
                    type="Father"
                    label="Father Name"
                    placeholder="Enter your Father Name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                  />
                  <br />
                  <TextField
                    name="Mother"
                    type="Mother"
                    label="Mother name"
                    placeholder="Enter your Mother Name"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                  />
                  <br />
                  <TextField
                    name="phone"
                    type="phone"
                    label="Phone"
                    placeholder="Enter your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <br />
                  <TextField
                    name="Education"
                    type="Education"
                    label="Education"
                    placeholder="Enter Mention your Education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                  <br />
                  <TextField
                    name="Job"
                    type="Job"
                    label="Job"
                    placeholder="Enter Speify your Job"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                  />
                  <br />
                  <TextField
                    name="City"
                    type="City"
                    label="City"
                    placeholder="Enter Speify your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <br />
                  <div className="image-upload-box">
                    <label>
                      <h4>Upload Image</h4>
                    </label>
                    <input
                      className="image-input"
                      type="file"
                      name="image"
                      onChange={handleUpload}
                    />
                  </div>
                  <br />
                  <div className="submit-btn">
                    {loading ? (
                      <Button variant="contained">Updating...</Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleUpdate()}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </form>
              </div>
              <br />
              <Button
                variant="contained"
                color="error"
                onClick={() => setShow(!show)}
              >
                Delete Account
              </Button>
            </div>
          )}
        </div>
        <div className="update-user-expectations">
          <div className="update-expectation-box">
            <h1 className="user-profile-title">
              Update Your Expectations here
            </h1>
            <form className="exp-update-form">
              <div className="exp-age-box">
                <h2>Age:</h2>
                <TextField
                  name="age1"
                  type="age1"
                  label="From"
                  placeholder="Age from"
                  value={expAge1}
                  onChange={(e) => setExpAge1(e.target.value)}
                />
                <h4>-</h4>
                <TextField
                  name="age2"
                  type="age2"
                  label="To"
                  placeholder="Age To"
                  value={expAge2}
                  onChange={(e) => setExpAge2(e.target.value)}
                />
              </div>
              <br />
              <div className="exp-city-box">
                <h2 className="exp-city-head">City: </h2>
                <TextField
                  name="City"
                  type="City"
                  label="City"
                  placeholder="Enter Expected City"
                  value={expCity}
                  onChange={(e) => setExpCity(e.target.value)}
                />
              </div>
              <br />
              <div className="submit-btn">
                {loading1 ? (
                  <Button variant="contained">Updating...</Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateExpectation()}
                  >
                    Update
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {snackmsg}
            </Alert>
          </Snackbar>
        </Stack>
      </div>
    </Base>
  );
};

export default User;
