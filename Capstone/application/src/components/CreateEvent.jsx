import React from "react";
import '../style/createEvent.css';
import { Navigation } from '/';
import { NavLink } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";


function generateID() {
    var randID = Math.floor(Math.random() * Date.now()).toString(36)
    return randID
}

var spotToken = sessionStorage.getItem("spotToken");
if (spotToken) {
    var spotifyInfo = JSON.parse(sessionStorage.spotToken);
    console.log(spotToken)
}
var gooProfile = sessionStorage.getItem("gooProfile");
if (gooProfile) {
    var googleInfo = JSON.parse(sessionStorage.gooProfile);
}

var aSwitch1 = true;
var aSwitch2 = true;

var anotherSwitch = false;

var eventText = "";
var buttonText = "";
var radioShow = 'none';

var thisEventName = sessionStorage.getItem('eventViewEvent');
var pageStatus = sessionStorage.getItem('EventCreateLP');
//Edit event
if (pageStatus === 'view') {
    // document.getElementById('create').innerHTML = 'Save Changes';
    // document.getElementById('EventName').value = thisEventName;
    radioShow = 'none';
    eventText = thisEventName;
    buttonText = 'Save Changes';
    // document.getElementById('ChoosePlaylist').style.display = 'none';
    //Change date

    //Change attendees list
    var attendees = [];

}
//New event
else {
    // document.getElementById('create').innerHTML = 'Continue to Playlist';
    // document.getElementById('EventName').value = "";
    radioShow = 'block';
    eventText = "";
    buttonText = 'Continue to Playlists';
    //document.getElementById('ChoosePlaylist').style.display = 'block';
    //Change date

    //Change attendees list
    var attendees = [];
    if (spotToken) {
        attendees.push(spotifyInfo.displayName);
    }
    if (gooProfile) {
        attendees.push(googleInfo.email);
    }
}

const CreateEvent = () => {
    document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';
    const [person, setPerson] = useState('')
    const [eventName, setEvent] = useState('')
    const [aDate, setDate] = useState('')
    const [users, setUsers] = useState('')

    //Get all the registered users
    useEffect(() => {
        var allUsers = [];
        axios.get(`http://localhost:3000/api/v1/get_users`).then(response => {
            for (var i = 0; i < response.data.length; i++) {
                allUsers.push(response.data[i].username);
            }
            setUsers(allUsers);
        }).catch((err) => { console.log(err.response) });
    }, []);

    const addOwner = () => {
        //Add the creator to the list of attendees
        if (spotToken) {
            return spotifyInfo.displayName + " (Owner)";
        }
        if (gooProfile) {
            return googleInfo.email + " (Owner)";
        }
    }

    const addPerson = (e) => {
        //Add to the list of names when + clicked
        if (person !== "" && users.includes(person)) {
            if (!attendees.includes(person)) {
                attendees.push(person);
                console.log(attendees)
            }
            var newPerson = document.createElement("li");
            newPerson.innerHTML = person;
            newPerson.className = 'thisList';
            newPerson.onclick = function (e) {
                //REMOVE ATTENDEE
                e.target.parentNode.removeChild(e.target);
            }
            document.getElementById("Attendees").appendChild(newPerson);
            setPerson("");
            document.getElementById("AttName").value = "";
        }
        //Add warning
        if (!users.includes(person)) {
            document.getElementById('attWarning').innerHTML = 'User does not exist'
            document.getElementById('attWarning').style.display = 'block';
        }
        else if (users.includes(person)) {
            document.getElementById('attWarning').style.display = 'none';
        }
        if (person === "") {
            document.getElementById('attWarning').innerHTML = 'Please enter a username'
            document.getElementById('attWarning').style.display = 'block';
        }
        else if (!person === "") {
            document.getElementById('attWarning').style.display = 'none';
        }
    }

    const removePerson = (e) => {
        console.log(e.target)
        console.log('hi')
    }

    const createButton = (e) => {
        //Check if event name is blank
        if (eventName == "") {
            document.getElementById("nameWarning").style.display = "block";
            aSwitch1 = false;
        }
        else {
            document.getElementById("nameWarning").style.display = "none";
            aSwitch1 = true;
        }
        //Check if date selection is blank
        if (aDate == "") {
            document.getElementById("dateWarning").style.display = "block";
            aSwitch2 = false;
        }
        else {
            document.getElementById("dateWarning").style.display = "none";
            aSwitch2 = true;
        }

        if (aSwitch1 && aSwitch2) {
            sessionStorage.setItem('playlistLP', 'new');
            sessionStorage.setItem('playlistUsers', users);

            //Check whether the user wanted a filled playlist or an empty playlist
            if (document.getElementById("switch").checked) {
                sessionStorage.setItem('playlistStatus', 'filled')
            }
            else {
                sessionStorage.setItem('playlistStatus', 'empty')
            }

            setTimeout(() => { window.location.href = "/PlaylistCreate"; }, 1000)
        }

        //Add event to the db
        //attendees = JSON.stringify(attendees)
        console.log(attendees)
        var eid = generateID()
        sessionStorage.setItem("eventID", eid)
        console.log('tigewge ' + aDate.replace(/-/g, '/'))
        if (spotToken) {
            var eventID = sessionStorage.getItem("eventID")
            axios.post('http://localhost:3000/api/v1/create_event', {
                eid: eventID,
                uid: spotifyInfo.id,
                name: eventName,
                location: spotifyInfo.location,
                attendees: attendees,
                date: aDate.replace(/-/g, '/')
            }).then(res => { console.log(res.data) }).catch((e) => { console.error(e) })
        } else if (gooProfile) {
            axios.post('http://localhost:3000/api/v1/create_event', {
                eid: sessionStorage.getItem("eventID"),
                uid: googleInfo.id,
                name: eventName,
                location: googleInfo.location,
                attendees: attendees,
                date: aDate.replace(/-/g, '/')
            }).then(res => { console.log(res.data) }).catch((e) => { console.error(e) })
        }

    }

    /* const [person, setPerson] = useState('')
    const [eventName, setEvent] = useState('')
    const [aDate, setDate] = useState('')
 */
    return (
        <div>
            <Navigation />
            <div id="mainDiv">
                <p id='nameWarning'>Please enter a name for the event.</p>
                <input type="text"
                    id="EventName"
                    name="Ename"
                    defaultValue={eventText}
                    placeholder="Name of Event"
                    onChange={event => setEvent(event.target.value)}>
                </input>
                <div id='AttWrapper'>
                    <h1 class='HomeTitle'>
                        Attendees:
                    </h1>
                </div>
                <button id="AddAtt"
                    onClick={addPerson}>
                    +
                </button>
                <p id='attWarning'>
                    Please enter a username
                </p>
                <input type="text"
                    id="AttName"
                    name="Attname"
                    defaultValue={person}
                    placeholder="Name (Click to delete)"
                    onChange={event => setPerson(event.target.value)}>
                </input>
                <ul id="Attendees">
                    <li id='owner'>{addOwner()}</li>
                </ul>
                <p id='dateWarning'>Please enter a date.</p>
                <input type="date"
                    id="date"
                    name="date"
                    onChange={event => setDate(event.target.value)}></input>
                <p id='playlistWarning'>Please choose a playlist.</p>
                <p id='Recommended'>Recommended Playlist?</p>
                <div id="ChoosePlaylist" style={{ display: radioShow }}>
                    <input type="checkbox" id="switch" class="checkbox" defaultChecked={true}/>
                    <label for="switch" class="toggle"/>
                    <p id='recoDesc'>Choose whether you want to start off with an already recommended playlist, or create an empty playlist where you can view recommendations.</p>
                </div>
            </div>
            <button id='create' class='testtt' onClick={createButton}>
                {buttonText}
            </button>
        </div>
    );
}

export default CreateEvent;