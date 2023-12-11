import React, { useEffect, useState } from "react";
import Base from "../Base/Base";
import "./Favourites.css";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import asserts from "../assert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

//Backend URL
const api_url = asserts.backend_url;

const Favourites = () => {
  let navigate = useNavigate();
  let [profiles, setProfiles] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }

    //Fetching data
    let fetchAllData = async () => {
      //Get All Profiles Data
      try {
        const response = await axios.get(`${api_url}/user/get-favourites`, {
          headers: {
            "x-auth": token,
          },
        });
        //console.log(response.data);
        setProfiles(response.data.favourites);
      } catch (error) {
        console.error("Error In Fetching Data:", error);
      }
    };
    //Calling fetch function
    fetchAllData();
    console.log(profiles);
  }, []);

  return (
    <Base>
      <div className="favourites-container">
        <h1 className="fav-title">
          <span>Explore and revisit your favorite matches,</span>
          <span>where love stories begin</span>
        </h1>
        <div className="profile-container">
          {profiles.length ? (
            profiles.map((val, index) => <Profiles key={index} data={val} />)
          ) : (
            <div>No Data Found</div>
          )}
        </div>
      </div>
    </Base>
  );
};

const Profiles = ({ data }) => {
  let [alt, setAlt] = useState("");
  let [snackmsg, setSnackmsg] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    if (data.gender === "Female") {
      setAlt(
        "https://www.vivahasangamam.in/images/female-pending-approval.png"
      );
    } else {
      setAlt("https://www.vivahasangamam.in/images/male-pending-approval.png");
    }
  }, []);

  //Handle Send Request
  async function handleRequest({ id }) {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${api_url}/invitation/sent`,
        { id },
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg(`Request sent to ${data.name}`);
      handleClick();
    } catch (error) {
      console.error("Error Adding Favourites:", error);
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
    <Card sx={{ maxWidth: 345, mb: 2 }} className="profiles-cards">
      <CardMedia
        sx={{ height: 300, width: 300 }}
        image={data.image ? data.image : alt}
        title={data.name}
        onClick={() => navigate(`/profile/${data._id}`)}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age:{data.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          City:{data.City}
        </Typography>
      </CardContent>
      <CardActions className="card-btns">
        <PersonAddIcon
          color="primary"
          sx={{ fontSize: 50 }}
          onClick={() => handleRequest({ id: data._id })}
        />
      </CardActions>
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
    </Card>
  );
};

export default Favourites;
