import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import "./SignUp.css";
import axios from "axios";
import asserts from "../assert";
import { useNavigate } from "react-router-dom";


//Backend URL
const api_url = asserts.backend_url;

//Validation Schema
let fieldValidationSchema = yup.object({
  name: yup.string().required("Please Enter your Name"),
  email: yup.string().required("Please Enter your Email"),
  password: yup.string().required("Create New Password"),
  phone: yup.string().required("Please Enter your contact Number"),
  dob: yup.string().required("Please Enter your Date of Birth"),
  gender: yup.string().required("Please Specify your Gender"),
  City: yup.string().required("Please Specify your City"),
});
const SignUp = () => {
  let [loading, setLoading] = useState(null);
  let navigate=useNavigate()
  let { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      name: "",
      password: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      City: "",
    },
    validationSchema: fieldValidationSchema,
    onSubmit: (user) => {
      handleSignUp(user);
    },
  });

  async function handleSignUp(user) {
    setLoading(1);
    let age = Date.now() - new Date(user.dob).getTime();
    let age_dt = new Date(age);
    user["age"] = Math.abs(age_dt.getUTCFullYear() - 1970);

    try {
      let response=await axios.post(`${api_url}/auth/signup`, user);
      localStorage.setItem("token", response.data.token);
      navigate("/")
    } catch (error) {
      alert("Singup error, please try later");
      console.log("SignUp error", error);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Sign Up</h1>
        <br />
        <form onSubmit={handleSubmit} className="signup-form">
          <TextField
            name="name"
            type="name"
            label="Name"
            placeholder="Enter your name"
            value={values.name}
            onChange={handleChange}
          />
          {errors.name ? (
            <div style={{ color: "crimson" }}>{errors.name}</div>
          ) : (
            ""
          )}
          <br />
          <TextField
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email ? (
            <div style={{ color: "crimson" }}>{errors.email}</div>
          ) : (
            ""
          )}
          <br />
          <div className="gender-box">
            <h2 className="gender-title">Gender</h2>
            <div className="gender-input">
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
              />
              <label id="Male">Male</label>
            </div>
            <div className="gender-input">
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
              />
              <label id="Female">Female</label>
            </div>
          </div>
          {errors.gender ? (
            <div style={{ color: "crimson" }}>{errors.gender}</div>
          ) : (
            ""
          )}
          <br />
          <div className="dob-box">
            <label>
              <h4>DOB</h4>
            </label>
            <input
              className="dob-input"
              type="date"
              name="dob"
              value={values.dob}
              onChange={handleChange}
            />
          </div>
          {errors.dob ? (
            <div style={{ color: "crimson" }}>{errors.dob}</div>
          ) : (
            ""
          )}
          <br />
          <TextField
            name="phone"
            type="phone"
            label="Phone"
            placeholder="Enter your Phone Number"
            value={values.phone}
            onChange={handleChange}
          />
          {errors.phone ? (
            <div style={{ color: "crimson" }}>{errors.phone}</div>
          ) : (
            ""
          )}
          <br />
          <TextField
            name="City"
            type="City"
            label="City"
            placeholder="Enter Speify your City"
            value={values.City}
            onChange={handleChange}
          />
          {errors.City ? (
            <div style={{ color: "crimson" }}>{errors.City}</div>
          ) : (
            ""
          )}
          <br />
          <TextField
            name="password"
            type="password"
            label="Password"
            placeholder="Creat New Password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password ? (
            <div style={{ color: "crimson" }}>{errors.password}</div>
          ) : (
            ""
          )}
          <br />
          <div className="submit-btn">
            {loading ? (
              <Button variant="contained" type="submit">
                Signing Up...
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                Sign Up
              </Button>
            )}
          </div>
        </form>
        <br />
        <div>
          <p className="log-btn">
            Already have an account ? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
