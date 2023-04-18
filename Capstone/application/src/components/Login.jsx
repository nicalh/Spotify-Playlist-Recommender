import React from "react";
import '../style/login.css';
import { NavLink } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import * as $ from "jquery";

var aSwitch = false;
var anotherSwitch = false;

var currentPlaylist = [];

localStorage.clear();

const Login = () => {
  //Spotify Stuff
  const CLIENT_ID = ""
  const REDIRECT_URI = "http://localhost:3001/"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  var scope = 'playlist-read-collaborative playlist-read-private playlist-modify-public playlist-modify-private streaming user-read-private user-read-email user-top-read'
  

  //useStates
  const [token, setToken] = useState("")
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    //onSuccess: () => window.location.href = "/Home",
    onError: (error) => console.log('Login Failed:', error)
  });

  //This gets the token when someone logs in with spotify
  //token = user's spotify access token
  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);
          //res.data is the profile data for the google account
          const gooProfile = {
            accountID: res.data.id,
            email: res.data.email,
            token: user.access_token,
            name: res.data.name,
            locale: res.data.locale
          }
          sessionStorage.clear();
          sessionStorage.setItem("gooProfile", JSON.stringify(gooProfile));
          console.log(gooProfile)

          axios.post(`http://localhost:3000/api/v1/login`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.access_token}`
            },
            uid: gooProfile.accountID,
            user: gooProfile.name,
            email: gooProfile.email,
            country: gooProfile.locale
          })
            .then(function (response) {
              console.log(response);
            }).catch((err) => {
              console.log(err.response)
            })
          //Change screen
          setTimeout(() => { window.location.href = "/Home"; }, 1000)
        })
        .catch((err) => console.log(err));
    }

    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)
    // sessionStorage.setItem("spotToken", token);

  }, [user])

  console.log("THIS IS TOKEN: " + token);
  console.log("THIS IS " + aSwitch);

  //Check if token exists so page will change
  if (token) {
    aSwitch = true;
  }

  if (aSwitch) {
    if (token) {
      $.ajax({
        url: "https://api.spotify.com/v1/me",
        type: "GET",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (data) => {
          const spotInfo = {
            id: data.id,
            displayName: data.display_name,
            token: token,
            email: data.email,
            country: data.country
          }
          sessionStorage.clear();
          sessionStorage.setItem("spotToken", JSON.stringify(spotInfo));
          console.log(data);

          //TODO: Put your POST here and use spotInfo declared a few lines ago
          axios.post('http://localhost:3000/api/v1/login', {
            uid: spotInfo.id,
            user: spotInfo.displayName,
            email: spotInfo.email,
            country: spotInfo.country
          })
            .then(function (response) {
              console.log(response);
            }).catch((err) => {
              console.log(err)
            })

          //Get top artists
          if (!anotherSwitch) {
            anotherSwitch = true;
            $.ajax({
              url: `https://api.spotify.com/v1/me/top/tracks`,
              type: "GET",
              beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
              },
              success: (data) => {
                //Actually get the songs
                for (var x = 0; x < data.items.length; x++) {
                  //Check if song name contains a ' and check it's length
                  if (!data.items[x].name.includes("'") && !data.items[x].name.includes("&")) {
                    var songObj = {};
                    var art = '';
                    var newID = data.items[x].uri.replace('spotify:track:', '');
                    songObj.sid = newID;
                    songObj.title = data.items[x].name;
                    for (var y = 0; y < data.items[x].artists.length; y++) {
                      art === '' ? art = data.items[x].artists[y].name :
                        art += (", " + data.items[x].artists[y].name);
                    }
                    songObj.artists = art;
                    songObj.album = data.items[x].album.name;
                    currentPlaylist.push(songObj);
                  }
                }

                axios.post('http://localhost:3000/api/v1/add_user_songs', {
                  songs: currentPlaylist,
                  uid: spotInfo.id,
                }).then(res => { console.log(res.body) }).catch((e) => console.error(e))
              }
            });
          }

          //Change the screen

          setTimeout(() => { window.location.href = "/Home"; }, 1000);
        }
      });

    }
  } else {

    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cm9hZCUyMHRyaXB8ZW58MHx8MHx8&w=1000&q=80')";

    //When the Spotify button is pressed, do this
    const spotifyLogin = (e) => {
      // e.preventDefault();
      console.log(token);
    }

    return (
      <div id="outline">
        <h1 class='text' id='RTTitle'>
          <b>Tripify</b>
        </h1>
        <p class='text'>
          Automatically create perfect road-trip playlists with your friends.
          To begin please login with Google or Spotify.
        </p>
        <button type="button" id='google' class='text' onClick={() => login()}>
          <p class='text' id='buttonText'>
            Login with Google
          </p>
          <img id='googleLogo'
            src="https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227"
            alt='Google Logo'>
          </img>
        </button>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scope}`}>
            <button id='spotify' class='text' onClick={spotifyLogin}>
              <p class='text' id='buttonText'>
                Login with Spotify
              </p>
              <img id='spotifyLogo'
                src="https://www.citypng.com/public/uploads/small/11661570388xlqve2emckykh8duxvsgpvh7twc500yxmhrxeqceos5tlsy69cafnjapavvuls7qozpoi4rz8u97zecjlqnva0yy38a7xxuxbu2r.png"
                alt='Spotify Logo'>
              </img>
            </button>
          </a>
          : <NavLink to="/Home">
            <button type="button" id='spotify' class='text' onClick={spotifyLogin}>
              <p class='text' id='buttonText'>
                Login with Spotify
              </p>
              <img id='spotifyLogo'
                src="https://www.citypng.com/public/uploads/small/11661570388xlqve2emckykh8duxvsgpvh7twc500yxmhrxeqceos5tlsy69cafnjapavvuls7qozpoi4rz8u97zecjlqnva0yy38a7xxuxbu2r.png"
                alt='Spotify Logo'>
              </img>
            </button>
          </NavLink>}
      </div>
    );
  }
}

export default Login;
