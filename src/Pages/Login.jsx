import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import asserts from "../assert";


//Backend URL
const api_url = asserts.backend_url;

//Validation Schema
let fieldValidationSchema = yup.object({
  email: yup.string().required("Please Enter your Email"),
  password: yup.string().required("Please Enter a Valid Password"),
});
const Login = () => {
  let navigate = useNavigate();
  let [loading, setLoading] = useState(null);
  let { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    validationSchema: fieldValidationSchema,
    onSubmit: (user) => {
      handleLogin(user);
    },
  });

  async function handleLogin(user) {
    setLoading(1);
    try {
      let response = await axios.post(
        `${api_url}/auth/login`,
        user
      );
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch {
      alert("Invalid Credentials");
      setLoading(false);
    }
  }
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>LogIn</h1>
        <br />
        <form onSubmit={handleSubmit} className="signup-form">
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
          <div>
            <p className="log-btn">
              <a
                href="/reset-password"
                style={{ marginLeft: "65%", color: "blue" }}
              >
                Forgot Password ?
              </a>
            </p>
          </div>
          <br />
          <div className="submit-btn">
            {loading ? (
              <Button variant="contained" type="submit">
                Logging In...
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                LogIn
              </Button>
            )}
          </div>
        </form>
        <br />
        <div>
          <p className="log-btn">
            Don't haven account ?{" "}
            <a href="/signup" style={{ color: "blue" }}>
              Register !
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
