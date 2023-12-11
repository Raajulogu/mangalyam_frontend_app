import React, { useEffect, useState } from "react";
import Base from "../Base/Base";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Profile.css";
import { CardMedia } from "@mui/material";
import asserts from "../assert";

//Backend URL
const api_url = asserts.backend_url;

const Profile = () => {
  let { id } = useParams();
  let [user, setUser] = useState();
  let [alt, setAlt] = useState("");

  useEffect(() => {
    //Fetching data
    let fetchAllData = async () => {
      //Get User Data
      try {
        const response = await axios.get(
          `${api_url}/user/get-particular-profile-data`,
          {
            headers: {
              id: id,
            },
          }
        );

        setUser(response.data.profile);
        if (response.data.profile.gender === "Female") {
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

  return (
    <Base>
      {user && (
        <div className="profile-complete-data-container">
          <div className="profile-image-container">
            <CardMedia
              sx={{ height: 770, width: 500 }}
              image={user.image ? user.image : alt}
              title="green iguana"
            />
          </div>
          <div className="profile-data-container">
            <h1>Details</h1>
            <div className="profile-details-box">
              <p>
                <b>Name:</b> {user.name}
              </p>
              <p>
                <b>Age:</b> {user.age}
              </p>
              <p>
                <b>Father Name:</b>{" "}
                {user.fatherName ? user.fatherName : <span>NA !</span>}
              </p>
              <p>
                <b>Mother Name:</b>{" "}
                {user.motherName ? user.motherName : <span>NA !</span>}
              </p>
              <p>
                <b>Phone:</b> {user.phone}
              </p>
              <p>
                <b>Date of birth:</b> {user.dob}
              </p>
              <p>
                <b>Education:</b>{" "}
                {user.education ? user.education : <span>NA !</span>}
              </p>
              <p>
                <b>Job:</b> {user.job ? user.job : <span>NA !</span>}
              </p>
              <p>
                <b>City:</b> {user.City}
              </p>
              {user.expextations && (
                <div className="profile-expectations-data">
                  <h2>
                    <u>
                      <b>Expectations:</b>
                    </u>
                  </h2>
                  <p>
                    <b>Age:</b> {user.expextations.age[0]} to{" "}
                    {user.expextations.age[1]}
                  </p>
                  <p>
                    <b>City:</b> {user.expextations.City}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Base>
  );
};

export default Profile;
