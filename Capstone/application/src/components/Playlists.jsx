import React, { Children, useState, useEffect } from "react";
import '../style/playlists.css';
import { Navigation } from '/';
import { NavLink } from "react-router-dom";
import axios from "axios";
import SpotifyPlayer from 'react-spotify-web-playback';



var thisID = '3';

var aList = [];

const track = {
  name: "",
  album: {
    images: [
      { url: "" }
    ]
  },
  artists: [
    { name: ""}
  ]
}


const Playlists = () => {
  var spotToken = sessionStorage.getItem("spotToken");
  if (spotToken) {
    var spotifyInfo = JSON.parse(spotToken);
    var id = JSON.parse(spotToken).id;
  }
  var gooProfile = sessionStorage.getItem("gooProfile");
  if (gooProfile) {
    var googleInfo = JSON.parse(sessionStorage.gooProfile);
    var id = JSON.parse(sessionStorage.gooProfile).id;
  }
  

  document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';

  const [playList, setPlaylist] = useState([]);
  const [songs, setSongs] = useState([]);
  const [ player, setPlayer] = useState(undefined)
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive ] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [ playID, setPlayID] = useState("")
  const [shown, setShown] = useState(false)
  useEffect(() => {
    // axios.get('http://localhost:3000/api/v1/view_playlist?pid=fbufrkot&uid=2iu1r7vw')
    axios.get(`http://localhost:3000/api/v1/view_playlist?uid=${id}`)
      .then(response => {
        setPlaylist(response.data);
        for (var x = 0; x < response.data.length; x++) {
          if (!aList.includes(response.data[x].pid)) {
            aList.push(response.data[x].pid);
            var baseRow = document.createElement('tr');
            baseRow.className = 'clickable';
            baseRow.onclick = TableClick;
            baseRow.setAttribute('pid', response.data[x].pid);
            baseRow.innerHTML = response.data[x].name;
            document.getElementById('Playlists').appendChild(baseRow);
          }
        }

      }).then(playList => console.log("this" + playList))
      .catch((err) => console.error(err.response));
    axios.get(`http://localhost:3000/api/v1/view_playlist_songs?pid=${thisID}`).then(response => { setSongs(response.data) }).catch((err) => console.error(err))
  }, []);
  




  const deletePlaylist = (e) => {
    var old = document.getElementsByClassName("clickable selected");
    if (old.length === 1) {
      //DELETE PLAYLIST HERE
      document.getElementById("playWarn").style.display = "none";


      //GET THE NAME OF PLAYLIST
      var pName = old[0].children[0].innerHTML;
    }
    else {
      document.getElementById("playWarn").style.display = "block";
    }
  }

  const editPlaylist = (e) => {
    var old = document.getElementsByClassName("clickable selected");
    if (old.length === 1) {
      var pName = old[0].innerHTML;
      sessionStorage.setItem("pName", pName);
      sessionStorage.setItem('playlistLP', 'edit');
      sessionStorage.setItem('ogPlaylist', old[0].innerHTML);
      sessionStorage.setItem('playlistID', thisID)
      window.location.href = "/PlaylistCreate";
    }
    else {
      document.getElementById("playWarn").style.display = "block";
    }
  }

  const TableClick = (e) => {
    //Reset the table on the right
    //document.getElementById('Play').innerHTML = "";
    thisID = e.target.getAttribute('pid');
    setPlayID(thisID)
    var spotifyPlayURL = `https://open.spotify.com/embed/playlist/${thisID}?utm_source=generator`;
    console.log(spotifyPlayURL);
    document.getElementById("frame").setAttribute("src", spotifyPlayURL);

    var old = document.getElementsByClassName("clickable selected");
    if (old.length === 1) {
      old[0].style.background = "rgb(234, 237, 235)";
      old[0].style.color = "rgb(97, 161, 161)";
      old[0].className = "clickable";
    }
    e.target.style.background = "rgb(97, 161, 161)";
    e.target.style.color = 'white';
    e.target.className = "clickable selected";

    //Get the id of the playlist clicked
/*     thisID = e.target.getAttribute('pid');
    setPlayID(thisID)
    var spotifyPlayURL = `https://open.spotify.com/embed/playlist/${thisID}?utm_source=generator`;
    console.log(spotifyPlayURL);
    document.getElementsByTagName("iframe").src = spotifyPlayURL; */
    
    console.log(e.target.getAttribute('pid'))
    axios.get(`http://localhost:3000/api/v1/view_playlist_songs?pid=${thisID}`).then(response => {
      setSongs(response.data);
      //for (var y = 0; y < response.data.length; y++) {
/*         var baseRow = document.createElement('tr');

        var titleCell = document.createElement('td');
        titleCell.innerHTML = response.data[y].title;
        baseRow.appendChild(titleCell);

        var artistCell = document.createElement('td');
        artistCell.innerHTML = response.data[y].artist;
        baseRow.appendChild(artistCell);

        var albumCell = document.createElement('td');
        albumCell.innerHTML = response.data[y].album;
        baseRow.appendChild(albumCell);

        document.getElementById('Play').appendChild(baseRow); */
      //}


    }).catch((err) => console.error(err))

    //Fill the table on the right
    //var baseTable = document.getElementById("Play");
    
    //Make this for loop go through the songs in the playlist clicked
/*     for (var x = 0; x < songs.length; x++) {
      var baseRow = document.createElement('tr');
      var songName = document.createElement('td');

      //PUT SONG NAME HERE
      songName.innerHTML = songs[x].title;
      baseRow.appendChild(songName);
      console.log(songs[x].title)

      var artistName = document.createElement('td');

      //PUT Artist NAME HERE
      artistName.innerHTML = songs[x].artist;
      baseRow.appendChild(artistName);

      var albumName = document.createElement('td');

      //PUT Album NAME HERE
      albumName.innerHTML = songs[x].album;
      baseRow.appendChild(albumName);

      baseTable.appendChild(baseRow);
    } */
    
    
  }

  
  const playlistLength = songs.length
  console.log(playlistLength)
  
  return (
    <div>
      <Navigation />
      <div id="generalDiv">
        <div id="leftDiv">
          <p id="playWarn">Please select a playlist</p>
          <div id="titlePlaylist">
            <p id="titleDesc">Your playlists are below. Select one and view it on the right.</p>
          </div>
          <div id="playlistWrapper">
            <table id='Playlists' cellSpacing={"0"}>
              <tr>
                <th>Name</th>
                {/* <th>Listeners</th> */}
                {/* <th>Num. of Songs</th> */}
                <th></th>
              </tr>

            </table>
          </div>
          <div id="playlistDelete" class="buttonClick" onClick={deletePlaylist}>
            Delete Playlist
          </div>
          <div id="editPlaylistButton" class="buttonClick" onClick={editPlaylist}>
            Edit Playlist
          </div>
        </div>
        <div id="rightDiv">
          <div id='PlayOutline'>
            <table id='Play' cellSpacing={"0"}>
              <div className="container">
                <div className="main-wrapper">
                  
                  <iframe id="frame" style={{borderRadius:12}} width="100%" height="450" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                  
                    </div>
                  </div>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlists;