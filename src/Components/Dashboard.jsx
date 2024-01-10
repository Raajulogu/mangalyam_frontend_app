import React, { useEffect, useState } from "react";
import Base from "../Base/Base";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import "./Dashboard.css";
import asserts from "../assert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

//Backend URL
const api_url = asserts.backend_url;

const Dashboard = () => {
  let navigate = useNavigate();
  let [profiles, setProfiles] = useState();
  let [otherProfiles, setOtherProfiles] = useState([]);
  let [search, setSearch] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }

    //Fetching data
    let fetchAllData = async () => {
      try {
        const response = await axios.get(`${api_url}/user/get-profiles`, {
          headers: {
            "x-auth": token,
          },
        });
        setProfiles(response.data.profileData.profiles);
        setOtherProfiles(response.data.profileData.allProfiles);
      } catch (error) {
        console.error("Error In Fetching Data:", error);
        localStorage.removeItem("token");
      }
      //Get User Data
      try {
        const response = await axios.get(`${api_url}/auth/get-user-data`, {
          headers: {
            "x-auth": token,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error In Fetching Data:", error);
      }
    };
    //Calling fetch function
    fetchAllData();
  }, []);

  return (
    <Base>
      {profiles && user && (
        <div className="home-container">
          <div className="search-container">
            <TextField
              label="Search"
              sx={{ m: 5, width: "75ch" }}
              placeholder="search profile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {search.length > 0 ? (
            <div className="searched-content">
              {otherProfiles.map((val, index) => (
                <div className="searched-data">
                  {(val.name.toLowerCase().includes(search.toLowerCase()) ||
                    val.City.toLowerCase().includes(search.toLowerCase())) && (
                    <Profiles key={index} data={val} user={user} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="non-search content">
              <div className="profile-titles">
                <h1>Destiny Matches</h1>
              </div>
              <div className="profile-container">
                {profiles.length ? (
                  profiles.map((val, index) => (
                    <Profiles key={index} data={val} user={user} />
                  ))
                ) : (
                  <div>
                    {profiles.length <= 0 ? (
                      <p>
                        No data found for your Expextations, Please Update your
                        expectations to get Matched Profile
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                )}
              </div>
              <br />
              <div className="profile-titles">
                <h1>You may also like</h1>
              </div>
              <div className="profile-container">
                {otherProfiles.length ? (
                  otherProfiles.map((val, index) => (
                    <Profiles key={index} data={val} user={user} />
                  ))
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Base>
  );
};

const Profiles = ({ data, user }) => {
  let [fav, setFav] = useState(false);
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

  //Handle Favourites
  async function handleFavourites({ id }) {
    setFav(true);
    let token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${api_url}/user/favourites`,
        { id },
        {
          headers: {
            "x-auth": token,
          },
        }
      );
      setSnackmsg("Profile Added to Favorites");
      handleClick();
    } catch (error) {
      console.error("Error Adding Favourites:", error);
    }
  }
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
        {fav || user.favourites.includes(data._id) ? (
          <FavoriteIcon sx={{ color: "red", fontSize: 50 }} />
        ) : (
          <FavoriteBorderIcon
            onClick={() => handleFavourites({ id: data._id })}
            sx={{ fontSize: 50 }}
          />
        )}
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

export default Dashboard;
