import React, { useEffect, useState } from "react";
import Base from "../Base/Base";
import "./Interested.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import asserts from "../assert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

//Backend URL
const api_url = asserts.backend_url;

const Interested = () => {
  let navigate = useNavigate();
  let [profiles, setProfiles] = useState([]);
  let [invitationSent, setInvitationSent] = useState([]);
  let [invitationGot, setInvitationGot] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }

    //Fetching data
    let fetchAllData = async () => {
      //Get interested Profiles Data
      try {
        const response = await axios.get(`${api_url}/interest/get-interest`, {
          headers: {
            "x-auth": token,
          },
        });
        setProfiles(response.data.interested);
      } catch (error) {
        console.error("Error In Fetching Data:", error);
      }

      //Get Invitations Profiles Data
      try {
        const response = await axios.get(
          `${api_url}/invitation/get-invitations`,
          {
            headers: {
              "x-auth": token,
            },
          }
        );
        setInvitationGot(response.data.invitations.invitationGot);
        setInvitationSent(response.data.invitations.invitationSent);
      } catch (error) {
        console.error("Error In Fetching Data:", error);
      }
    };
    //Calling fetch function
    fetchAllData();
  }, []);

  return (
    <Base>
      <div className="interested-container">
        <div className="row interested-row">
          <div className="col-md-6 interested-box">
            <h1 className="profile-titles">Your Interested profiles</h1>
            <div className="profile-container-interested">
              {profiles.length ? (
                profiles.map((val, index) => (
                  <Profiles key={index} data={val} />
                ))
              ) : (
                <div>You don't have Interested profiles</div>
              )}
            </div>
          </div>
          <div className="col-md-4 request-box">
            <h1 className="invitation-title">
              <u>New Request</u>
            </h1>
            <div className="invitation-got">
              {invitationGot.length ? (
                invitationGot.map((val, index) => (
                  <Requests key={index} data={val} />
                ))
              ) : (
                <div>No Request's</div>
              )}
            </div>
            <h1 className="invitation-title">
              <u>Invitation Sent</u>
            </h1>
            <div className="invitation-sent">
              {invitationSent.length ? (
                invitationSent.map((val, index) => (
                  <Sent key={index} data={val} />
                ))
              ) : (
                <div>No Pending Invitations</div>
              )}
            </div>
          </div>
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
  async function handleRemove({ id }) {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${api_url}/interest/remove-interest`,
        { id },
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg(`You removed ${data.name} from your interested list`);
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
        <MessageIcon
          color="primary"
          sx={{ fontSize: 40 }}
          onClick={() => navigate("/message")}
        />
        <PersonRemoveIcon
          sx={{ color: `crimson`, fontSize: 40 }}
          onClick={() => handleRemove({ id: data._id })}
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

//New Request Card
const Requests = ({ data }) => {
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

  //Handle Accept Request
  async function handleAccept({ id }) {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${api_url}/interest/add-interest`,
        { id },
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg(`You're Accepted ${data.name}'s request`);
      handleClick();
    } catch (error) {
      console.error("Error Adding Favourites:", error);
    }
  }
  //Handle Decline Request
  async function handleDecline({ id }) {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${api_url}/invitation/delete-reciever-side`,
        { id },
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg(`You're Declined ${data.name}'s request`);
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
    <div className="request-container">
      <div
        className="requset-user-data"
        onClick={() => navigate(`/profile/${data._id}`)}
      >
        <div>
          <Avatar alt={alt} src={data.image} />
        </div>
        <div className="request-data">
          <span className="request-title">
            <h3>{data.name}</h3>, {data.age}yrs
          </span>
        </div>
      </div>
      <div className="request-btn-box">
        <div className="request-btns">
          <Button
            variant="contained"
            onClick={() => handleAccept({ id: data._id })}
          >
            Accept
          </Button>
        </div>
        <div className="request-btns">
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDecline({ id: data._id })}
          >
            Decline
          </Button>
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
  );
};

//Invitation Sent Component
const Sent = ({ data }) => {
  let [alt, setAlt] = useState("");
  let [snackmsg, setSnackmsg] = useState("");
  useEffect(() => {
    if (data.gender === "Female") {
      setAlt(
        "https://www.vivahasangamam.in/images/female-pending-approval.png"
      );
    } else {
      setAlt("https://www.vivahasangamam.in/images/male-pending-approval.png");
    }
  }, []);

  //Handle Cancell request
  async function handleCancel({ id }) {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${api_url}/invitation/delete-user-side`,
        { id },
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg(`You're Cancelled your request to ${data.name}`);
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
    <div className="request-container">
      <div className="requset-user-data">
        <div>
          <Avatar alt={alt} src={data.image} />
        </div>
        <div className="request-data">
          <span className="request-title">
            <h3>{data.name}</h3>, {data.age}yrs
          </span>
        </div>
      </div>
      <div className="request-btn-box">
        <Button
          variant="contained"
          color="success"
          onClick={() => handleCancel({ id: data._id })}
        >
          Cancel Request
        </Button>
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
  );
};

export default Interested;
