import React, { useState, useEffect } from "react";
import '../style/eventView.css';
import { Navigation } from '/';
import axios from "axios";
//import { NavLink } from "react-router-dom";

var spotToken = sessionStorage.getItem("spotToken");
if (spotToken) {
  var spotifyInfo = JSON.parse(sessionStorage.spotToken);
}
var gooProfile = sessionStorage.getItem("gooProfile");
if (gooProfile) {
  var googleInfo = JSON.parse(sessionStorage.gooProfile);
}

var eventName = sessionStorage.getItem('eventViewEvent');

const EventView = () => {
    const [ eventUsers, setEventUsers ] = useState([])
    const [ eventPlaylists, setEventPlaylists ] = useState([])
    const [ eventSongs, setEventSongs ] = useState([])

    document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';

    useEffect(() => {
        var eventID = sessionStorage.getItem('eventID')
        axios.get(`http://localhost:3000/api/v1/view_event_users?eid=${eventID}`).then(res => setEventUsers(res.data)).catch(err => console.error(err));
        axios.get(`http://localhost:3000/api/v1/view_event_playlist?eid=${eventID}`).then(res => axios.get(`http://localhost:3000/api/v1/view_playlist_songs?pid=${res.data[0].pid}`).then(res => setEventSongs(res.data)).catch((err) => console.error(err))).catch(err => console.error(err));
        console.log(eventPlaylists)
        //axios.get(`http://localhost:3000/api/v1/view_playlist_songs?pid=${eventPlaylists[0].pid}`).then(res => setEventSongs(res.data)).catch((err) => console.error(err))
        //console.log(eventSongs)
    }, [])
    var currentPlaylist = []
    for (var i = 0; i < eventSongs.length; i++) {
        var songObj = {};
        songObj.id = eventSongs[i].id;
        songObj.title = eventSongs[i].title;
        songObj.artists = eventSongs[i].artist;
        songObj.album = eventSongs[i].album;
        songObj.uri = eventSongs[i].uri;
        currentPlaylist.push(songObj);
    }
    console.log(currentPlaylist)

    const addOwner = () => {
        //Add the creator to the list of attendees
        if (spotToken) {
            return spotifyInfo.displayName + " (Owner)";
        }
        if (gooProfile) {
            return googleInfo.email + " (Owner)";
        }
    }
    
    const deleteEvent = (e) => {
        window.location.href = "/Home";

        //DELETE FROM DB
        
    }

    const editEvent = (e) => {
        sessionStorage.setItem('EventEditName', eventName);
        //Set the last page prior to going to CreateEvent so it makes edits rather than creates
        sessionStorage.setItem('EventCreateLP', 'view');
        window.location.href = "/CreateEvent";
    }

    return (
        <div>
            <Navigation/>
            <div id='thisEventName'>
                {eventName}
            </div>
            <div id='thisEventDate'>
                Happening on 
            </div>
            <div id='attendeesDiv'>
                <ul id='attendeesList'>
                    <li id='TITLE'>Attendees</li>
                    <li>{addOwner()}</li>
                    {eventUsers.map((user) => <li style= {{display: 'block'}}>{user.username}</li>)}
                </ul>
            </div>
            <div id="eventDelete" class="buttonClick" onClick={deleteEvent}>
                Delete Event
            </div>
            <div id="editEventButton" class="buttonClick" onClick={editEvent}>
                Edit Event
            </div>
            <div id='eventPlaylist'>
                <table id='theseSongs'>
                    {currentPlaylist.map((songs) => <tr>{songs.title}</tr>)}
                </table>
            </div>
        </div>
    );
}

export default EventView;