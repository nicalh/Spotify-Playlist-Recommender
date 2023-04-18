import React from "react";
import '../style/profile.css';
import { Navigation } from '/';
import { useState } from 'react';
import * as $ from "jquery";

var genresList = [];
var artistsList = [];

const Profile = () => {
  document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';
  const [genre, setGenre] = useState('')
  const [artist, setArtist] = useState('')
  const [artistSearch, setSearch] = useState('')

  const addGenre = (e) => {
    //Add to the list of names when + clicked
    console.log(genre)
    if (genre !== "") {
      if (!genresList.includes(genre)) {
        genresList.push(genre);
        console.log(genresList)
      }
      var newPerson = document.createElement("li");
      newPerson.innerHTML = genre;
      newPerson.className = 'thisList';
      newPerson.onclick = function (e) {
        //REMOVE ATTENDEE
        e.target.parentNode.removeChild(e.target);
      }
      document.getElementById("Genres").appendChild(newPerson);
      setGenre("");
      document.getElementById("genreIn").value = "";
    }
  }

  const addArtist = (e) => {
    var thisID = e.target.parentNode.getAttribute('artid');

    //Check if song is already in playlist
    console.log(thisID)
    if (!artistsList.some(e => e.id === thisID)) {
      var songObj = {};
      songObj.id = thisID;
      songObj.title = e.target.parentNode.getAttribute('name');
      artistsList.push(songObj);
      console.log(artistsList)

      //Make the new element and add it 
      var tabRow = document.createElement('tr');
      tabRow.style.cursor = 'pointer';
      tabRow.onclick = removeArtist;
      tabRow.setAttribute('artid', thisID);

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

      document.getElementById('currentLikes').appendChild(tabRow);
    }
  }

  const removeArtist = (e) => {
    var thisID = e.target.parentNode.getAttribute('artid');
    var songs = document.getElementById('currentLikes');
    for (var x = 0; x < songs.children.length; x++) {
      if (songs.children[x].getAttribute('artid') === thisID) {
        songs.removeChild(songs.children[x]);
      }
    }
    for (var y=0; y < artistsList.length; y++) {
      if (artistsList[y].id === thisID) {
        console.log('egeg')
        artistsList.splice(y, 1);
      }
    }
  }

  const searchBut = (e) => {
    var spotToken = sessionStorage.getItem("spotToken");
    if (spotToken) {
      var spotifyInfo = JSON.parse(spotToken);
    }
    var gooProfile = sessionStorage.getItem("gooProfile");
    if (gooProfile) {
      var googleInfo = JSON.parse(sessionStorage.gooProfile);
    }

    //Clear existing table
    document.getElementById('findArtists').innerHTML = "";

    var results = [];
    //Search button
    $.ajax({
      url: `https://api.spotify.com/v1/search?query=${encodeURIComponent(artistSearch)}&type=artist`,
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + spotifyInfo.token);
      },
      success: (data) => {
        console.log(data.artists.items)
        for (var result = 0; result < data.artists.items.length; result++) {
          console.log('regre')
          var tabRow = document.createElement('tr');
          tabRow.style.cursor = 'pointer';
          tabRow.onclick = addArtist;
          tabRow.setAttribute('artid', data.artists.items[result].id);
          tabRow.setAttribute('name', data.artists.items[result].name);

          var coverCell = document.createElement('td');
          var coverIMG = document.createElement('img');
          coverIMG.src = data.artists.items[result].images[0].url;
          coverIMG.style.display = 'block';
          coverIMG.style.width = '30%';
          coverIMG.style.height = '30%';
          coverCell.appendChild(coverIMG);
          tabRow.appendChild(coverCell);

          var name = document.createElement('td');
          name.innerHTML = data.artists.items[result].name;
          tabRow.appendChild(name);

          document.getElementById('findArtists').appendChild(tabRow);
        }
      }
    });
  }

  return (
    <div>
      <Navigation />
      <div id='LikesTitle'>
        Favourite Artists
      </div>
      <div id='LikesDiv'>
        <table id='currentLikes'>

        </table>
      </div>
      <div id='GenresTitle'>
        Favourite Genres
      </div>
      <div id='GenresDiv'>
        <input type="text"
          id="genreIn"
          name="Gname"
          placeholder="Add Genre"
          onChange={event => setGenre(event.target.value)}>
        </input>
        <button id="AddGenre"
          onClick={addGenre}>
          +
        </button>
        <ul id='Genres'>
        </ul>
      </div>

      <div id='searchDiv'>
        <input type="text"
          id="searchIn"
          name="Aname"
          placeholder="Search (Click to add)"
          onChange={event => setSearch(event.target.value)}>
        </input>
        <div id="searchButton" onClick={searchBut}>
          Search
        </div>
      </div>
      <div id="FindDiv">
        <table id="findArtists">

        </table>
      </div>
    </div>
  );
}

export default Profile;