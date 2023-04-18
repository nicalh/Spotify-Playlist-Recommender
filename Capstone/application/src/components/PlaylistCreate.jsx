import React, { useEffect } from "react";
import '../style/playlistCreate.css';
import { Navigation } from '/';
import { NavLink } from "react-router-dom";
import { useState } from 'react';
import * as $ from "jquery";
import axios from "axios";

var currentPlaylist = [];

function msToMin(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function generateID() {
  var randID = Math.floor(Math.random() * Date.now()).toString(36)
  return randID
}

var aSwitch = false;

const PlaylistCreate = () => {
  const [playlistName, setPlaylist] = useState('')
  const [songSearch, setSearch] = useState('')

  var spotToken = sessionStorage.getItem("spotToken");
  if (spotToken) {
    var spotifyInfo = JSON.parse(spotToken);
  }
  var gooProfile = sessionStorage.getItem("gooProfile");
  if (gooProfile) {
    var googleInfo = JSON.parse(sessionStorage.gooProfile);
  }

  document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';

  /* const doneButton = (e) => {
    axios.post('/api/v1/create_playlist', {
      eid: 'p8rk0ex',
      songs: currentPlaylist,
      uid: spotifyInfo.id,
      name: playlistName
    }).then(res =>{console.log(res.body)}).catch((e) => console.error(e))

    if (playlistName != "") {
      document.getElementById('pWarning').style.display = 'none';
      setTimeout(() => {window.location.href = "/EventView";}, 1000)
      
    }
    else {
      document.getElementById('pWarning').style.display = 'block';
    }
  } */

  if (!aSwitch) {
    aSwitch = true;
    //Check if this is a new playlist or an edited playlist
    if (sessionStorage.getItem('playlistLP') === 'edit') {
      //Load the current playlist
      var playlistID = sessionStorage.getItem('playlistID');
      console.log("PlaylistID: " + playlistID)
      axios.get(`http://localhost:3000/api/v1/view_playlist_songs?pid=${playlistID}`).then(response => {
        // grabbing playlist from db to add to list
        for (var i = 0; i < response.data.length; i++) {
          var songObj = {};
          songObj.id = response.data[i].id;
          songObj.title = response.data[i].title;
          songObj.artists = response.data[i].artist;
          songObj.album = response.data[i].album;
          songObj.uri = response.data[i].uri;
          currentPlaylist.push(songObj);

          $.ajax({
            url: `https://api.spotify.com/v1/tracks/${response.data[i].uri}`,
            type: "GET",
            beforeSend: (xhr) => {
              xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('spotToken')).token);
            },
            success: (data) => {
              var tabRow = document.createElement('tr');
              tabRow.style.cursor = 'pointer';
              tabRow.onclick = removeSong;
              tabRow.setAttribute('spotID', songObj.id);

              var coverCell = document.createElement('td');
              var coverIMG = document.createElement('img');
              coverIMG.src = data.album.images[0].url;
              coverIMG.style.display = 'block';
              coverIMG.style.width = '35%';
              coverIMG.style.height = '35%';
              coverCell.appendChild(coverIMG);
              tabRow.appendChild(coverCell);

              var title = document.createElement('td');
              title.innerHTML = data.name;
              tabRow.appendChild(title);

              var art = '';
              for (var x = 0; x < data.artists.length; x++) {
                art === '' ? art = data.artists[x].name :
                  art += (", " + data.artists[x].name);
              }
              var thisArtists = document.createElement('td');
              thisArtists.innerHTML = art;
              tabRow.appendChild(thisArtists);

              var thisAlbum = document.createElement('td');
              thisAlbum.innerHTML = data.album.name;
              tabRow.appendChild(thisAlbum);

              var runtime = document.createElement('td');
              runtime.innerHTML = msToMin(data.duration_ms);
              tabRow.appendChild(runtime);

              document.getElementById('currentPlay').appendChild(tabRow);
            }
          });

          
        }
      })
      const removeSong = (e) => {
        var thisID = e.target.parentNode.getAttribute('spotid');
        var songs = document.getElementById('currentPlay');
        for (var x = 0; x < songs.children.length; x++) {
          if (songs.children[x].getAttribute('spotid') === thisID) {
            songs.removeChild(songs.children[x]);
          }
        }
        for (var y = 0; y < currentPlaylist.length; y++) {
          if (currentPlaylist[y].id === thisID) {
            currentPlaylist.splice(y, 1);
          }
        }
        console.log(currentPlaylist)
      }

      
      var ogName = sessionStorage.getItem('ogPlaylist');
    }
    else {
      var thisEID = sessionStorage.getItem('eventID')
      currentPlaylist = [];
      var ogName = "";
      var users = sessionStorage.getItem('playlistUsers');
      users = users.split(',');
      var userString = '';
      for (var w = 0; w < users.length; w++) {
        if (userString === '') {
          userString = users[w];
        }
        else {
          userString += users[w];
        }
      }

      //Check whether the user wanted a redommended playlist or not
      if (sessionStorage.getItem('playlistStatus') === 'filled') {
        //Put top songs into playlist
        for (var j=0; j<users.length;j++) {
        axios.get(`http://localhost:3000/api/v1/get_top_songs?users=${users[j]}`).then(response => {
          for (var i = 0; i < response.data.length; i++) {
            var songObj = {};
            songObj.id = response.data[i].sid;
            songObj.title = response.data[i].title;
            songObj.artists = response.data[i].artist;
            songObj.album = response.data[i].album;
            songObj.uri = response.data[i].uri;
            currentPlaylist.push(songObj);

            //Make the new element and add it 
            //Get the cover image
            $.ajax({
              url: `https://api.spotify.com/v1/tracks/${response.data[i].uri}`,
              type: "GET",
              beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('spotToken')).token);
              },
              success: (data) => {
                var tabRow = document.createElement('tr');
                tabRow.style.cursor = 'pointer';
                tabRow.onclick = removeSong;
                tabRow.setAttribute('spotID', songObj.id);

                var coverCell = document.createElement('td');
                var coverIMG = document.createElement('img');
                coverIMG.src = data.album.images[0].url;
                coverIMG.style.display = 'block';
                coverIMG.style.width = '35%';
                coverIMG.style.height = '35%';
                coverCell.appendChild(coverIMG);
                tabRow.appendChild(coverCell);

                var title = document.createElement('td');
                title.innerHTML = data.name;
                tabRow.appendChild(title);

                var art = '';
                for (var x = 0; x < data.artists.length; x++) {
                  art === '' ? art = data.artists[x].name :
                    art += (", " + data.artists[x].name);
                }
                var thisArtists = document.createElement('td');
                thisArtists.innerHTML = art;
                tabRow.appendChild(thisArtists);

                var thisAlbum = document.createElement('td');
                thisAlbum.innerHTML = data.album.name;
                tabRow.appendChild(thisAlbum);

                var runtime = document.createElement('td');
                runtime.innerHTML = msToMin(data.duration_ms);
                tabRow.appendChild(runtime);

                document.getElementById('currentPlay').appendChild(tabRow);
              }
            
            });
          

            //Fill recommended songs with songs from artists used
            //Table = RecPlaylist
            //Get songs from artist or similar artist
            var artists = response.data[i].artist.split(", ");
            var thisArtist = artists[Math.floor(Math.random() * artists.length)];
            $.ajax({
              url: `https://api.spotify.com/v1/search?query=${thisArtist}&type=track`,
              type: "GET",
              beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + spotifyInfo.token);
              },
              success: (data) => {
                //Select a random track out of the results
                var newSong = data.tracks.items[Math.floor(Math.random() * data.tracks.items.length)];
                for (var track = 0; track < data.tracks.items.length; track++) {
                  var song = {};
                  var art = '';
                  song.songName = newSong.name;
                  for (var x = 0; x < newSong.artists.length; x++) {
                    art === '' ? art = newSong.artists[x].name :
                      art += (", " + newSong.artists[x].name);
                  }
                  song.artists = art;
                  song.album = newSong.album.name;
                  song.duration = msToMin(newSong.duration_ms);
                  song.cover = newSong.album.images[0].url;
                  song.ID = newSong.id;
                  song.uri = newSong.uri.replace('spotify:track:', '');
                }
                var tabRow = document.createElement('tr');
                tabRow.style.cursor = 'pointer';
                tabRow.onclick = addSong;
                tabRow.setAttribute('spotID', song.ID);
                tabRow.setAttribute('artists', song.artists);
                tabRow.setAttribute('album', song.album);
                tabRow.setAttribute('title', song.songName);
                tabRow.setAttribute('uri', song.uri);

                var coverCell = document.createElement('td');
                var coverIMG = document.createElement('img');
                coverIMG.src = song.cover;
                coverIMG.style.display = 'block';
                coverIMG.style.width = '100%';
                coverIMG.style.height = '100%';
                coverCell.appendChild(coverIMG);
                tabRow.appendChild(coverCell);

                var title = document.createElement('td');
                title.innerHTML = song.songName;
                tabRow.appendChild(title);

                var thisArtists = document.createElement('td');
                thisArtists.innerHTML = song.artists;
                tabRow.appendChild(thisArtists);

                var thisAlbum = document.createElement('td');
                thisAlbum.innerHTML = song.album;
                tabRow.appendChild(thisAlbum);

                var runtime = document.createElement('td');
                runtime.innerHTML = song.duration;
                tabRow.appendChild(runtime);

                document.getElementById('ReceommendedTable').appendChild(tabRow);
              }
            });

          }
        }).catch((err) => { console.log(err.response) });
        
        }


        console.log(currentPlaylist)
      }
      else {
        //Fill recommended songs with attendees' top tracks
        axios.get(`http://localhost:3000/api/v1/get_top_songs?eid=${thisEID}`).then(response => {
          for (var i = 0; i < response.data.length; i++) {
            var songObj = {};
            songObj.id = response.data[i].sid;
            songObj.title = response.data[i].title;
            songObj.artists = response.data[i].artist;
            songObj.album = response.data[i].album;
            songObj.uri = response.data[i].uri;

            //Make the new element and add it 
            //Get the cover image
            $.ajax({
              url: `https://api.spotify.com/v1/tracks/${response.data[i].uri}`,
              type: "GET",
              beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem('spotToken')).token);
              },
              success: (data) => {
                var tabRow = document.createElement('tr');
                tabRow.style.cursor = 'pointer';
                tabRow.onclick = addSong;
                tabRow.setAttribute('spotID', data.id);
                tabRow.setAttribute('album', data.album.name);
                tabRow.setAttribute('title', data.name);
                tabRow.setAttribute('uri', data.uri);

                var coverCell = document.createElement('td');
                var coverIMG = document.createElement('img');
                coverIMG.src = data.album.images[0].url;
                coverIMG.style.display = 'block';
                coverIMG.style.width = '35%';
                coverIMG.style.height = '35%';
                coverCell.appendChild(coverIMG);
                tabRow.appendChild(coverCell);

                var title = document.createElement('td');
                title.innerHTML = data.name;
                tabRow.appendChild(title);

                var art = '';
                for (var x = 0; x < data.artists.length; x++) {
                  art === '' ? art = data.artists[x].name :
                    art += (", " + data.artists[x].name);
                }
                var thisArtists = document.createElement('td');
                thisArtists.innerHTML = art;
                tabRow.setAttribute('artists', songObj.art);
                tabRow.appendChild(thisArtists);

                var thisAlbum = document.createElement('td');
                thisAlbum.innerHTML = data.album.name;
                tabRow.appendChild(thisAlbum);

                var runtime = document.createElement('td');
                runtime.innerHTML = msToMin(data.duration_ms);
                tabRow.appendChild(runtime);

                document.getElementById('ReceommendedTable').appendChild(tabRow);
              }
            });
          }
        }).catch((err) => { console.log(err.response) });
      }
    }
  }

  const addSong = (e) => {
    var thisID = e.target.parentNode.getAttribute('spotID');

    //Check if song is already in playlist
    if (!currentPlaylist.some(e => e.id === thisID)) {
      var songObj = {};
      songObj.id = thisID;
      songObj.title = e.target.parentNode.getAttribute('title');
      songObj.artists = e.target.parentNode.getAttribute('artists');
      songObj.album = e.target.parentNode.getAttribute('album');
      songObj.uri = e.target.parentNode.getAttribute('uri');
      currentPlaylist.push(songObj);
      console.log(currentPlaylist)

      //Make the new element and add it 
      var tabRow = document.createElement('tr');
      tabRow.style.cursor = 'pointer';
      tabRow.onclick = removeSong;
      tabRow.setAttribute('spotID', thisID);

      var childs = e.target.parentNode.children;
      //This makes the html elements
      for (var y = 0; y < childs.length; y++) {
        if (y === 0) {
          var coverCell = document.createElement('td');
          var coverIMG = document.createElement('img');
          coverIMG.src = childs[y].children[0].src;
          coverIMG.style.display = 'block';
          coverIMG.style.width = '35%';
          coverIMG.style.height = '35%';
          coverCell.appendChild(coverIMG);
          tabRow.appendChild(coverCell);
        }
        else {
          var thisCell = document.createElement('td');
          thisCell.innerHTML = childs[y].innerHTML;
          console.log("HERE " + childs[y])
          tabRow.appendChild(thisCell);
        }
      }

      document.getElementById('currentPlay').appendChild(tabRow);
    }
  }

  const removeSong = (e) => {
    var thisID = e.target.parentNode.getAttribute('spotid');
    var songs = document.getElementById('currentPlay');
    for (var x = 0; x < songs.children.length; x++) {
      if (songs.children[x].getAttribute('spotid') === thisID) {
        songs.removeChild(songs.children[x]);
      }
    }
    for (var y = 0; y < currentPlaylist.length; y++) {
      if (currentPlaylist[y].id === thisID) {
        currentPlaylist.splice(y, 1);
      }
    }
    console.log("playlist currently: " + currentPlaylist)
  }

  const searchBut = (e) => {
    //Clear existing table
    document.getElementById('findSongs').innerHTML = "";

    var results = [];
    //Search button
    $.ajax({
      url: `https://api.spotify.com/v1/search?query=${encodeURIComponent(songSearch)}&type=track`,
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + spotifyInfo.token);
      },
      success: (data) => {
        results = [];
        for (var track = 0; track < data.tracks.items.length; track++) {
          var song = {};
          var art = '';
          song.songName = data.tracks.items[track].name;
          for (var x = 0; x < data.tracks.items[track].artists.length; x++) {
            art === '' ? art = data.tracks.items[track].artists[x].name :
              art += (", " + data.tracks.items[track].artists[x].name);
          }
          song.artists = art;
          song.album = data.tracks.items[track].album.name;
          song.duration = msToMin(data.tracks.items[track].duration_ms);
          song.cover = data.tracks.items[track].album.images[0].url;
          song.ID = data.tracks.items[track].id;
          song.uri = data.tracks.items[track].uri.replace('spotify:track:', '');
          results.push(song);
        }
        for (var result = 0; result < results.length; result++) {
          var tabRow = document.createElement('tr');
          tabRow.style.cursor = 'pointer';
          tabRow.onclick = addSong;
          tabRow.setAttribute('spotID', results[result].ID);
          tabRow.setAttribute('artists', results[result].artists);
          tabRow.setAttribute('album', results[result].album);
          tabRow.setAttribute('title', results[result].songName);
          tabRow.setAttribute('uri', results[result].uri);

          var coverCell = document.createElement('td');
          var coverIMG = document.createElement('img');
          coverIMG.src = results[result].cover;
          coverIMG.style.display = 'block';
          coverIMG.style.width = '100%';
          coverIMG.style.height = '100%';
          coverCell.appendChild(coverIMG);
          tabRow.appendChild(coverCell);

          var title = document.createElement('td');
          title.innerHTML = results[result].songName;
          tabRow.appendChild(title);

          var thisArtists = document.createElement('td');
          thisArtists.innerHTML = results[result].artists;
          tabRow.appendChild(thisArtists);

          var thisAlbum = document.createElement('td');
          thisAlbum.innerHTML = results[result].album;
          tabRow.appendChild(thisAlbum);

          var runtime = document.createElement('td');
          runtime.innerHTML = results[result].duration;
          tabRow.appendChild(runtime);

          document.getElementById('findSongs').appendChild(tabRow);
        }
      }
    });
  }
  const doneButton = (e) => {
    console.log(currentPlaylist)
    var currentPlaylistURIs = []
    for (var i = 0; i < currentPlaylist.length; i++) {
      currentPlaylistURIs.push("spotify:track:"+currentPlaylist[i].uri)
    }
    console.log(currentPlaylistURIs)
    if (sessionStorage.getItem('playlistLP') === 'edit') {
      var playlistID = sessionStorage.getItem("playlistID");
      axios.put(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        uris: currentPlaylistURIs
      }, {
        headers: {
          'Authorization' : `Bearer ${spotifyInfo.token}`,
          'Content-Type' : 'application/json'
        }
      });

      axios.post(`http://localhost:3000/api/v1/create_playlist`, {
        eid: sessionStorage.getItem("eventID"),
        pid: playlistID,
        songs: currentPlaylist,
        uid: spotifyInfo.id,
        name: playlistName
      })
    } else {
    axios.post(`https://api.spotify.com/v1/users/${spotifyInfo.id}/playlists`, {
      name: playlistName,
      description: "",
      public: false,
      collaborative: true
    }, {
      headers: {
        'Authorization': `Bearer ${spotifyInfo.token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {axios.post(`https://api.spotify.com/v1/playlists/${res.data.id}/tracks`, {
      uris: currentPlaylistURIs,
      position: 0
    }, {
      headers: {
        'Authorization': `Bearer ${spotifyInfo.token}`,
        'Content-Type': 'application/json'
      }
    }, axios.post('http://localhost:3000/api/v1/create_playlist', {
      eid: sessionStorage.getItem("eventID"),
      pid: res.data.id,
      songs: currentPlaylist,
      uid: spotifyInfo.id,
      name: playlistName
    }).then(res => { console.log(res.data) }).catch((e) => console.error(e))).catch((e) => console.error(e))}).catch((e) => console.error(e))
    var newPlaylistID = sessionStorage.getItem("newplayid");
    console.log("PlaylistID: " + newPlaylistID)
    console.log(currentPlaylist)
  }
    if (playlistName != "") {
      document.getElementById('pWarning').style.display = 'none';
      setTimeout(() => { window.location.href = "/EventView"; }, 1000)

    }
    else {
      document.getElementById('pWarning').style.display = 'block';
    }
  
  }



  var playlistText = "";

  return (
    <div>
      <Navigation />

      <input type="text"
        id="pInName"
        name="Pname"
        placeholder="Name of Playlist"
        defaultValue={ogName}
        onChange={event => setPlaylist(event.target.value)}>
      </input>
      <div id="ViewPlaylist">
        <table id='currentPlay' cellSpacing={"0"}>

        </table>
      </div>
      <div id='RecTitle'>
        Recommended
      </div>
      <div id="RecPlaylist">
        <table id='ReceommendedTable' cellSpacing={"0"}>

        </table>
      </div>
      <div id='FindTitle'>
        Find Songs
      </div>
      <div id='searchDiv'>
        <input type="text"
          id="searchIn"
          name="Sname"
          placeholder="Search (Click to add)"
          onChange={event => setSearch(event.target.value)}>
        </input>
        <div id="searchButton" onClick={searchBut}>
          Search
        </div>
      </div>
      <div id="otherSongs">
        <table id="findSongs" cellSpacing={"0"}>

        </table>
      </div>
      <button id='doneButton' onClick={doneButton}>
        Done
      </button>
      <p id='pWarning'>Please enter a name for the playlist</p>
    </div>
  );
}

export default PlaylistCreate;