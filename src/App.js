import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Favourites from "./Components/Favourites";
import Message from "./Components/Message";
import Interested from "./Components/Interested";
import Profile from "./Components/Profile";
import User from "./Components/User";
import About from "./Components/About";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/message" element={<Message />} />
        <Route path="/interested" element={<Interested />} />
        <Route path="/user" element={<User />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
