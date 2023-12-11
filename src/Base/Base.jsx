import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Base.css";
import asserts from "../assert";

const Base = ({ children }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const api_url = asserts.backend_url;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (url) => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //Handle LogOut
  function handleLogOut() {
    handleCloseUserMenu();
    localStorage.removeItem("token");
    navigate("/login");
  }
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
    //Fetching data
    let fetchAllData = async () => {
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
    console.log(user)
  }, []);

  return (
    <div className="base-container">
      <header className="base-header">
        <nav>
          <AppBar position="static"
          sx={{background: "rgb(2,0,36)",
            background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(31,50,96,1) 37%, rgba(0,212,255,1) 100%)"}}
          >
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src="https://t3.ftcdn.net/jpg/01/34/58/02/360_F_134580286_qwzfps5JyCbU4EG8WdJdgtKPyUM0orWU.jpg"
                    style={{
                      height: "100px",
                      width: "100px",
                      display: { xs: "none", md: "flex" },
                    }}
                    alt=""
                  />
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    <MenuItem onClick={() => navigate("/")}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/favourites")}>
                      <Typography textAlign="center">Favourites</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/interested")}>
                      <Typography textAlign="center">Interested</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/message")}>
                      <Typography textAlign="center">Messages</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/about-us")}>
                      <Typography textAlign="center">About Us</Typography>
                    </MenuItem>
                  </Menu>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  <Button
                    onClick={() => navigate("/")}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate("/favourites")}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Favourites
                  </Button>
                  <Button
                    onClick={() => navigate("/interested")}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Interested
                  </Button>
                  <Button
                    onClick={() => navigate("/message")}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Messages
                  </Button>
                  <Button
                    onClick={() => navigate("/about-us")}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    About Us
                  </Button>
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={user&&user.name}
                        src={
                          user && user.image
                            ? user.image
                            : "/static/images/avatar/2.jpg"
                        }
                        sx={{ height: "70px", width: "70px" }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => navigate("/user")}
                      >
                        Profile
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>
                      <Typography textAlign="center">LogOut</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </nav>
      </header>
      <main className="main-child">{children}</main>
    </div>
  );
};

export default Base;
