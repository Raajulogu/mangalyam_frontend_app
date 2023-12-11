import React, { useEffect, useState } from "react";
import Base from "../Base/Base";
import "./Message.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import asserts from "../assert";

//Backend URL
const api_url = asserts.backend_url;

const Message = () => {
  let navigate = useNavigate();
  let [profiles, setProfiles] = useState([]);
  let [user, setUser] = useState([]);
  let [messageId, setMessageId] = useState(null);
  let [msgsent, setMsgsent] = useState(0);
  let [search, setSearch] = useState("");

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

  //Render on Message Sent
  useEffect(() => {
    let token = localStorage.getItem("token");
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
  }, [msgsent]);

  return (
    <Base>
      <div className="message-container">
        <div className="message-left-box">
          <div className="profile-container-1 message-profiles">
            <div className="message-user-title">
              <Avatar alt="" src={user.image} />
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
              <div>
                {profiles.length ? (
                  profiles.map((val, index) => (
                    <>
                      {(val.name.includes(search.toLowerCase()) ||
                        val.name.includes(search.toUpperCase())) && (
                        <Profiles
                          key={index}
                          data={val}
                          setMessageId={setMessageId}
                        />
                      )}
                    </>
                  ))
                ) : (
                  <div>No Data Found</div>
                )}
              </div>
            ) : (
              <div>
                {profiles.length ? (
                  profiles.map((val, index) => (
                    <Profiles
                      key={index}
                      data={val}
                      setMessageId={setMessageId}
                    />
                  ))
                ) : (
                  <div>No Data Found</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="message-right-box">
          <div className="profile-container-1 user-messages">
            {messageId && (
              <Messages
                messageId={messageId}
                user={user}
                setMsgsent={setMsgsent}
                msgsent={msgsent}
              />
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

const Profiles = ({ data, setMessageId }) => {
  let [alt, setAlt] = useState("");
  useEffect(() => {
    if (data.gender === "Female") {
      setAlt(
        "https://www.vivahasangamam.in/images/female-pending-approval.png"
      );
    } else {
      setAlt("https://www.vivahasangamam.in/images/male-pending-approval.png");
    }
  }, []);
  return (
    <div className="user-message-box" onClick={() => setMessageId(data)}>
      <div className="requset-user-data">
        <div>
          <Avatar alt={alt} src={data.image} />
        </div>
        <div className="request-data">
          <span className="request-title">
            <h3>{data.name}</h3>
          </span>
        </div>
      </div>
    </div>
  );
};

const Messages = ({ messageId, user, setMsgsent, msgsent }) => {
  let [alt, setAlt] = useState("");
  let [id, setId] = useState("");
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (messageId.gender === "Female") {
      setAlt(
        "https://www.vivahasangamam.in/images/female-pending-approval.png"
      );
    } else {
      setAlt("https://www.vivahasangamam.in/images/male-pending-approval.png");
    }
  }, []);

  useEffect(() => {
    setId(messageId._id);
  }, [messageId]);

  //Handle Send Message
  async function handleMessage({ id }) {
    if (message.length) {
      let data = {
        id: user._id,
        message,
      };
      let val = {
        data,
        id,
      };
      try {
        const response = await axios.put(`${api_url}/user/message`, val, {
          headers: {
            "x-auth": token,
          },
        });
        setMessage("");
        setId(messageId._id);
        setMsgsent(msgsent + 1);
      } catch (error) {
        console.error("Error In Fetching Data:", error);
      }
    }
  }
  return (
    <div className="user-message-container">
      <div className="profile-details">
        <div>
          <Avatar alt={alt} src={messageId.image} />
        </div>
        <div className="request-data">
          <span className="request-title">
            <h3>{messageId.name}</h3>
          </span>
        </div>
      </div>
      <div className="message-top">
        <div className="profile-messages">
          {id &&
            user.message&&user.message[id] &&
            user.message[id].map((val, index) => (
              <div key={index} className="message-content">
                <div
                  className={
                    val.id === user._id ? "message-right" : "message-left"
                  }
                >
                  <div
                    className="message-content-box"
                    id={
                      val.id === user._id
                        ? "message-right-color"
                        : "message-left-color"
                    }
                  >
                    {val.message}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="send-message message-bottom">
        <TextField
          label="Message"
          sx={{ m: 5, width: "72ch" }}
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton
                  onClick={() => handleMessage({ id: messageId._id })}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Message;
