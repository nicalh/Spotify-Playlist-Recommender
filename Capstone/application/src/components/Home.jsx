import React, { useState, useEffect } from "react";
import '../style/home.css';
import { Navigation } from '/';
import { NavLink } from "react-router-dom";
import axios from "axios";
import * as $ from "jquery";

//Get info from accounts (Just copy and paste this to the jsx file you need info on)

//Needs to be added
var aSwitch = false;

const Home = () => {
  const [eventList, setEventList] = useState([]);
  const [name, setName] = useState('')

  document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';

  // console.log("SPOTTOKEN = " + spotToken);
  // console.log("GOOPROFILE = " + gooProfile);
  // console.log(googleInfo.email)

  useEffect(() => {
    var name;
    var spotToken = sessionStorage.getItem("spotToken");
    if (spotToken) {
      var spotifyInfo = JSON.parse(spotToken);
      setName(spotifyInfo.displayName)

      /* axios.post(`http://localhost:3000/api/v1/login`, {
        uid: spotifyInfo.id,
        user: spotifyInfo.displayName,
        email: spotifyInfo.email,
        country: spotifyInfo.country
      }).then(response => { console.log(response) }).catch(err => console.log(err))
       */
      axios.get(`http://localhost:3000/api/v1/home?uid=${spotifyInfo.id}`).then(response => {
        setEventList(response.data);
        console.log(response.data)
        if (!aSwitch) {
        for (var x = 0; x < response.data.length; x++) {
            aSwitch = true;
            console.log(x)
            var baseRow = document.createElement('tr');
            baseRow.onclick = tableClick;
            baseRow.className = 'clickable';

            var nameCell = document.createElement('td');
            nameCell.innerHTML = response.data[x].name;
            baseRow.appendChild(nameCell);

            var dateCell = document.createElement('td');
            console.log('thisssss ' + response.data[x].date)
            dateCell.innerHTML = response.data[x].date;
            baseRow.appendChild(dateCell);

            document.getElementById('Events').appendChild(baseRow);
          }
        }
      }).catch((err) => { console.log(err.response) })
    }
    var gooProfile = sessionStorage.getItem("gooProfile");

    if (gooProfile) {
      var googleInfo = JSON.parse(sessionStorage.gooProfile);
      /*     axios.post(`http://localhost:3000/api/v1/login`, {
            uid: googleInfo.accountID,
            user: googleInfo.name,
            email: googleInfo.email,
            country: googleInfo.locale
          }).then(setName(googleInfo.name)
            ).catch((err) => {
              console.log(err.response)
            })
           */
      setName(googleInfo.name)
      axios.get(`http://localhost:3000/api/v1/home?uid=${googleInfo.accountID}`).then(response => {
        setEventList(response.data);
        if (!aSwitch) {
        for (var x = 0; x < response.data.length; x++) {
          
            aSwitch = true;
            var baseRow = document.createElement('tr');
            baseRow.onclick = tableClick;
            baseRow.className = 'clickable';

            var nameCell = document.createElement('td');
            nameCell.innerHTML = response.data[x].name;
            baseRow.appendChild(nameCell);

            var dateCell = document.createElement('td');
            dateCell.innerHTML = response.data[x].date;
            baseRow.appendChild(dateCell);

            document.getElementById('Events').appendChild(baseRow);
          }
        }
      }).catch((err) => { console.log(err.response) });
    }
  }, []);


  const tableClick = (e) => {
    sessionStorage.setItem("eventViewEvent", e.target.parentNode.children[0].innerHTML);
    window.location.href = "/EventView";
  }

  const addEvent = (e) => {
    sessionStorage.setItem("EventCreateLP", 'home');
  }

  return (
    <body>
      <div id="generalDiv">
        <div id="leftDiv">
          <div id="titleDiv" class="square">
            <h1 id="titleRoadTrip">Tripify</h1>
            <p id="titleDesc">Welcome {name} to Tripify. To the right you can view your events and playlists. Feel free to create an event as well.</p>
          </div>
        </div>
        <div id="rightDiv">
          <div id='EventOutline'>
            <div id='thisOutline'>
              <table id='Events' cellSpacing={"0"}>

              </table>
            </div>
            <NavLink to="/Playlists">
              <div id="playlistButton" class="titleButtons">
                View Playlists
              </div>
            </NavLink>
            <NavLink to="/CreateEvent">
              <div id="addEventButton" class="titleButtons" onClick={addEvent}>
                Add Event
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </body>
  );
}

export default Home;