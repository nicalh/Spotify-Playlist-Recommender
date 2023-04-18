import React from "react";
import "../style/navigation.css";
import { NavLink } from "react-router-dom";

function Navigation() {
  //Press this to go to profile
  const profileView = (e) => {
    //e.preventDefault();
    console.log('You are viewing the profile');
  }

  //Get info from accounts
  var name;
  var spotToken = sessionStorage.getItem("spotToken");
  if (spotToken) {
    var spotifyInfo = JSON.parse(sessionStorage.spotToken);
    name = "Hi, " + spotifyInfo.displayName;
  }
  var gooProfile = sessionStorage.getItem("gooProfile");
  if (gooProfile) {
    var googleInfo = JSON.parse(sessionStorage.gooProfile);
    name = "Hi, " + googleInfo.email;
  }

  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/Home">
            <b>Tripify</b>
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              <li id='userNameNav'>
                {name}
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Home">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Events">
                  Events
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Playlists">
                  Playlists
                </NavLink>
              </li>
            </ul>
          </div>
          <NavLink to="/Profile">
            <img  id="pfp"
                  src="https://static.thenounproject.com/png/5034901-200.png"
                  alt="Profile"
                  onClick={profileView}>
            </img>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;