import React, {useState, useEffect} from "react";
import '../style/events.css';
import {Navigation} from '/';
import { NavLink } from "react-router-dom";
import axios from "axios";

//For some reason this is needed because it loops otherwise 
var aSwitch = false;

const Events = () => {
  const [eventList, setEventList] = useState([]);

  document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';

  var spotToken = sessionStorage.getItem("spotToken");
  if (spotToken) {
    var spotifyInfo = JSON.parse(spotToken);
    var thisID = JSON.parse(spotToken).id;
  }
  var gooProfile = sessionStorage.getItem("gooProfile");
  if (gooProfile) {
    var googleInfo = JSON.parse(sessionStorage.gooProfile);
    var thisID = JSON.parse(sessionStorage.gooProfile).accountID;
  }

  if (!aSwitch) {
    axios.get(`http://localhost:3000/api/v1/home?uid=${thisID}`).then(response => {
      setEventList(response.data)
      for (var x = 0; x < response.data.length; x++) {
        var baseRow = document.createElement('tr');
        baseRow.className = 'clickable';
        baseRow.onclick = tableClick;

        var nameCell = document.createElement('td');
        nameCell.innerHTML = response.data[x].name;
        baseRow.appendChild(nameCell);

        var dateCell = document.createElement('td');
        dateCell.innerHTML = response.data[x].date;
        baseRow.appendChild(dateCell);

        document.getElementById('Events').appendChild(baseRow);
      }
    }).catch((err) => {console.log(err.response)})
  }
  aSwitch = true;

  const deleteEvent = (e) => {
    console.log('Delete Button Pressed');

    //Delete event from db
    
  }

  const addEvent = (e) => {
    sessionStorage.setItem("EventCreateLP", 'home');
    window.location.href = "/CreateEvent";

    //Add event to DB

  }

  const tableClick = (e) => {
    sessionStorage.setItem("eventViewEvent", e.target.parentNode.children[0].innerHTML);
    window.location.href = "/EventView";
  }
  
  return (
    <div>
      <Navigation/>
      <div id='MyEventOutline'>
        <div id='thisOutline'>
          <table id='Events' cellSpacing={"0"}>
            <tr>
              <th>Event</th>
              <th>Date</th>
            </tr>
          </table>
        </div>
      </div>
      <button id='addButton' onClick={addEvent}>
          New Event
      </button>
    </div>
  );
}

export default Events;