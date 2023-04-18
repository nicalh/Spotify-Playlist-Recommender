import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Events,
  Profile,
  Playlists,
  CreateEvent,
  EventView,
  PlaylistCreate,
  EditPlaylist
} from "./components";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="146039489824-o4tmpcjc9dkplbodm02s90i7t17vpis9.apps.googleusercontent.com">
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Events" element={<Events />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Playlists" element={<Playlists />} />
          <Route path="/CreateEvent" element={<CreateEvent />} />
          <Route path="/EventView" element={<EventView />} />
          <Route path="/PlaylistCreate" element={<PlaylistCreate />} />
          <Route path="/EditPlaylist" element={<EditPlaylist />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </GoogleOAuthProvider>,

  
);