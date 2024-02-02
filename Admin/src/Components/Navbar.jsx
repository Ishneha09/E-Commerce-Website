import React from 'react'
import "../styles/navbar.css";
import navprofile from "../assets/profilelogo.svg";
import navlogo from "../assets/logo2.png";
import { IoIosArrowDropdown } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className = "nav-left">
      <img src={navlogo} alt="" className="nav-logo" />
      </div>
      <div className = "text">
      <h1>Beautify</h1>
      <p>Admin Panel</p> 
      </div>
      
      <div className = "nav-right">
      <img src={navprofile} alt="" className="nav-profile" />
      </div>
      <div>
      <IoIosArrowDropdown className="dropdown-icon" />
      </div>
    </div>
  );
};

export default Navbar;
