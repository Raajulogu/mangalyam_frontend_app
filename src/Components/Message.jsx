import React, { useEffect, useState } from "react";
import Base from "../Base/Base";
import "./Message.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import asserts from "../assert";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//Backend URL
const api_url = asserts.backend_url;

const Message = () => {
  let navigate = useNavigate();
  let [profiles, setProfiles] = useState([]);
  let [user, setUser] = useState([]);
  let [messageId, setMessageId] = useState(null);
  let [msgsent, setMsgsent] = useState(0);
  let [search, setSearch] = useState("");
  let [show,setShow]=useState(false);
  let [showProfile,setShowProfile]=useState(false);

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
  console.log(search,search.length);

  return (
    <Base>
      <div className="message-container">
        <div className={`message-left-box ${messageId ? "none":"Show-profile"}`}>
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
                      {val.name.toLowerCase().includes(search.toLowerCase()) && (
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
        <div className={`message-right-box ${messageId ? "Show-profile":"none"}`}>
          <div className="profile-container-1 user-messages">
            {messageId && (
              <Messages
                messageId={messageId}
                user={user}
                setMsgsent={setMsgsent}
                msgsent={msgsent}
                setMessageId={setMessageId}
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

const Messages = ({ messageId, user, setMsgsent, msgsent,setMessageId }) => {
  let [alt, setAlt] = useState("");
  let [id, setId] = useState("");
  let [message, setMessage] = useState("");
  let [msgData, setMsgData] = useState([]);
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
    console.log(user)
    setId(messageId._id);
  }, [messageId]);
  useEffect(() => {
    let val=[];
    id && user.message && user.message[id] && user.message[id].map((res)=>{
      if(val.length===0){
        val.push([res])
      }
      else{
        if(res.date===val[val.length-1][0].date){
          val[val.length-1].push(res)
        }
        else{
          val.push([res])
        }
      }
    })
    setMsgData([...val]);
  }, [id]);

  //Handle Send Message
  async function handleMessage({ id }) {
    let day = new Date();
    let date=`${day.getDate()}/${day.getMonth()+1}/${day.getFullYear()}`
    let time=`${day.getHours()}:${day.getMinutes()} AM`
    if(day.getHours()>12){
      time=`${day.getHours()-12}:${day.getMinutes()} PM`
    }
    if(day.getMinutes()<10){
      time=`${day.getHours()-12}:0${day.getMinutes()} AM`
      if(day.getHours()>12){
        time=`${day.getHours()-12}:0${day.getMinutes()} PM`
      }
    }
    if (message.length) {
      let data = {
        id: user._id,
        message,
        date,
        time
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
        setMsgsent(msgsent + 1);
        setId(messageId._id);
      } catch (error) {
        console.error("Error In Fetching Data:", error);
      }
    }
  }
  return (
    <div className="user-message-container">
      <div className="profile-details">
      <ArrowBackIcon
          onClick={()=>{setMessageId(null)}}
          className="msg-back-arrow"
          />
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
            msgData.map((val, index) => (
              <div>
                <div
                className="msg-date-box"
                >
                <p
                className="msg-date"
                >{val[0].date}</p>
                </div>
                {val && val.map((res, index) =>(
                  <div key={index} className="message-content">
                  <div
                    className={
                      res.id === user._id ? "message-right" : "message-left"
                    }
                  >
                    <div
                      className="message-content-box"
                      id={
                        res.id === user._id
                          ? "message-right-color"
                          : "message-left-color"
                      }
                    >
                      <div
                      className="msg-box-insiders"
                      >
                      <p
                      className="messages"
                      >{res.message}</p>
                      <p
                      className="msg-time"
                      >{res.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
                ))

                }
              </div>
            ))}
        </div>
      </div>
      <div className="send-message message-bottom">
        <TextField
          label="Message"
          className="msg-input"
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
