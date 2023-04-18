import React from "react";
import '../style/editPlaylist.css';
import {Navigation} from '/';
import { NavLink } from "react-router-dom";

var pName = sessionStorage.getItem('pName');

const EditPlaylist = () => {
  document.body.style.backgroundImage = 'url("https://wallpapercave.com/wp/wp3283178.jpg"';

  const createPlaylist = (e) => {
    //Save playlist to db here
    
  }

  return (
    <div>
        <Navigation/>
        <input type="text"
            id="PlaylistName"
            name="Pname"
            defaultValue={pName}
            placeholder="Name of Playlist">
        </input>
        <div id="CurrentPlaylist">

        </div>
        <input type="search" 
               name="s" 
               id="searchbar"
               value="" 
               placeholder="Search">
        </input>
        <div id="Songs">
            
        </div>
        <div id="ChooseRec">
            <input type="checkbox" id="ChooseRecIn" name="recommended" value="Choose Rec"></input>
            <label for="ChooseRecIn">Recommended</label><br></br>
        </div>
        <NavLink to="/Playlists">
            <button id='createPlaylist' onClick={createPlaylist}>
                Save
            </button>
        </NavLink>
    </div>
  );
}

export default EditPlaylist;