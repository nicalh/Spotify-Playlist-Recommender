const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const port = 3000

var jsonParser = bodyParser.json()
const sql = require("mssql/msnodesqlv8");
const SpotifyWebApi = require('spotify-web-api-node');
const { json } = require('react-router-dom');


const config = {
    database: 'SpotifySite',
    server: 'LAPTOP-T03ROKEG',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }

}
const pool = new sql.ConnectionPool(config, (err) => {
    if (err) {
        console.log('Error while connecting to pool \n' + err)
    }
})

const spotifyapi = new SpotifyWebApi({
    clientId: '6ba6413f62fe45b3a7b35ad6c4f61a23',
    clientSecret: '4d444eec791b4b8cad5e843693817cf4',
    redirectUri: 'http://localhost:3000/callback'
})

pool.connect()

function addDate() {
    var date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let fullDate = `${year}${month}${day}`
    console.log(fullDate)
    return fullDate
}

function generateID() {
    var randID = Math.floor(Math.random() * Date.now()).toString(36)
    return "'" + randID + "'"
}

function addUser(ConnectionPool, uid, username, email, country) {
    var checkIDQuery = `SELECT uid from Users where uid = '${uid}'`;
    var userCheck = ConnectionPool.query(checkIDQuery).then(userCheck => {
        // if (userCheck.recordset != undefined && userCheck.recordset[0].uid != uid  ) {
        if (userCheck.recordset.length === 0) {
            var querystring = `INSERT INTO Users (uid, username, email, country) VALUES ('${uid}', '${username}', '${email}', '${country}');`;
            console.log(querystring)
            ConnectionPool.query(querystring)
        }//console.log(userCheck.recordset));
    })
}


function removeUser(ConnectionPool, uid) {
    var querystring = `DELETE FROM Users WHERE uid = ${uid}`
    ConnectionPool.query(querystring)
}

function addArtist(ConnectionPool, name, genre) {
    var querystring = `INSERT INTO Artist (artid, name, genre) VALUES (${artid}, '${name}', ${genre});`
    ConnectionPool.query(querystring)
}

function removeArtist(ConnectionPool, artid) {
    var querystring = `DELETE FROM Artist WHERE artid = ${artid}`
    ConnectionPool.query(querystring)
}

function addEvent(ConnectionPool, eid, orgid, name, location, date) {
    
    //date = addDate()
    var querystring = `INSERT INTO Events (eid, orgid, name, location, date) VALUES ('${eid}', '${orgid}', '${name}', '${location}', '${date}')`
    console.log(querystring)
    ConnectionPool.query(querystring)
}

function removeEvent(ConnectionPool, eid) {
    var querystring = `DELETE FROM Events WHERE eid = ${eid}`
    ConnectionPool.query(querystring)
}

function addPlaylist(ConnectionPool, pid, uid, name) {
    date = addDate()
    var querystring = `INSERT INTO Playlist (pid, uid, date, name) VALUES ('${pid}', '${uid}', '${date}', '${name}');`
    console.log(querystring)
    ConnectionPool.query(querystring)
}

function removePlaylist(ConnectionPool, pid) {
    var querystring = `DELETE FROM Playlist WHERE pid = '${pid}'`
    ConnectionPool.query(querystring)
}

function addPlaylistSongs(ConnectionPool, pid, sid) {
    var querystring = `INSERT INTO Playlist_Songs (pid, sid) VALUES ('${pid}', '${sid}');`
    console.log(querystring)
    ConnectionPool.query(querystring)

}

function removePlaylistSongs(ConnectionPool, pid) {
    var querystring = `DELETE FROM Playlist_Songs WHERE pid = '${pid}'`
    ConnectionPool.query(querystring)
}

function addSong(ConnectionPool, sid, title, artist, album, uri) {
    
    var querystring = `if not exists (select * from Song where title = '${title}' and artist = '${artist}' and album = '${album}')INSERT INTO Song (sid, title, artist, album, uri) VALUES ('${sid}', '${title}', '${artist}', '${album}', '${uri}');`
    console.log(querystring)
    ConnectionPool.query(querystring)
}

function removeSong(ConnectionPool, sid) {
    var querystring = `DELETE FROM Song WHERE sid = ${sid}`
    ConnectionPool.query(querystring)
}

function addAlbum(ConnectionPool, alid, name, artist, genre) {
    
    var querystring = `INSERT INTO Album (alid, name, artist, genre,) VALUES ('${alid}', '${name}', '${artist}', '${genre}');`
    ConnectionPool.query(querystring)
}

function removeAlbum(ConnectionPool, alid) {
    var querystring = `DELETE FROM alid WHERE alid = ${alid}`
    ConnectionPool.query(querystring)
}

function addEventPlaylist(ConnectionPool, eid, pid) {
    var querystring = `INSERT INTO Event_Playlist (eid, pid) VALUES ('${eid}', '${pid}');`
    console.log(querystring)
    ConnectionPool.query(querystring)
}

function removeEventPlaylist(ConnectionPool, eid, pid) {
    var querystring = `DELETE FROM Event_Playlist WHERE eid = '${eid}' AND pid = '${pid}'`
    ConnectionPool.query(querystring)
}

function addEventRegistered(ConnectionPool, eid, uid) {
    var querystring = `INSERT INTO Event_Registered (eid, uid) VALUES ('${eid}', '${uid}');`
    console.log(querystring)
    ConnectionPool.query(querystring)
}

function removeEventRegistered(ConnectionPool, eid, uid) {
    var querystring = `DELETE FROM Event_Registered WHERE eid = ${eid} AND uid = ${uid}`
    ConnectionPool.query(querystring)
}

function addUserArtist(ConnectionPool, uid, artid) {
    var querystring = `INSERT INTO User_Artist (uid, artid) VALUES (${uid}, ${artid});`
    ConnectionPool.query(querystring)
}


function removeUserArtist(ConnectionPool, uid, artid) {
    var querystring = `DELETE FROM UserArtist WHERE uid = ${uid} AND artid = ${artid}`
    ConnectionPool.query(querystring)
}

function addUserPreference(ConnectionPool, uid, genid) {
    var querystring = `INSERT INTO User_Preference (uid, genid) VALUES (${uid}, ${genid});`
    ConnectionPool.query(querystring)
}

function removeUserPreference(ConnectionPool, uid) {
    var querystring = `DELETE FROM User_Preference WHERE uid = '${uid}'`
    ConnectionPool.query(querystring)
}


/* function addUserSong(ConnectionPool, uid, sid) {
    var querystring = `INSERT INTO User_Song (uid, sid) VALUES ('${uid}', ${sid});` */
function addUserSong(ConnectionPool, uid, sid, uri) {
    var querystring = `IF exists (select * from Song where uri = '${uri}') IF not exists (select * from User_Song where uid = '${uid}' and uri = '${uri}') INSERT INTO User_Song (uid, sid, uri) VALUES ('${uid}', '${sid}', '${uri}');`
    console.log(querystring)
    ConnectionPool.query(querystring)
}

function removeUserSong(ConnectionPool, uid, sid) {
    var querystring = `DELETE FROM User_Song WHERE uid = ${uid} AND sid = ${sid}`
    ConnectionPool.query(querystring)
}

function getAttendeeSongs(ConnectionPool, users) {
    var querystring = `SELECT * FROM Song WHERE sid in (select sid from User_song where uid in '${users}')`
    ConnectionPool.query(querystring)
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/v1/login', jsonParser, (req, res) => {
    console.log(req.body)
    var uid = req.body.uid;
    var username = req.body.user;
    var email = req.body.email;
    var country = req.body.country;
    addUser(pool, uid, username, email, country)
    res.send({
        "code": 200,
        "status": "success"
    })
})

app.get('/api/v1/get_user', jsonParser, (req, res) => {
    var email = req.query.email;
    var querystring = `SELECT * FROM Users WHERE email = '${email}'`
    var result = pool.query(querystring).then((result) => res.send(result.recordset))
})
app.get('/api/v1/home', jsonParser, (req, res) => {
    var uid = req.query.uid
    console.log(uid)
    var querystring = `SELECT Events.eid, Events.name, Events.date FROM Users RIGHT JOIN Events ON Users.uid = Events.orgid WHERE Users.uid = '${uid}'`
    console.log(querystring)
    var result = pool.query(querystring).then((result) => res.send(result.recordset))

})
class EventID {
    constructor(eid) {
        this.eid = eid;
    }
}

// API call to create an event
app.post('/api/v1/create_event', jsonParser, (req, res) => {
    console.log(req.body)
    //var randeid = generateID()
    //eid = new EventID(randeid)
    //console.log("EventID: " + eid.eid)
    var eid = req.body.eid;
    console.log("EventID: " + eid)
    var uid = req.body.uid;
    var eventName = req.body.name;
    var location = req.body.location;
    var attendees = req.body.attendees;
    var date = req.body.date;
    console.log(date)
    console.log(attendees);
    addEvent(pool, eid, uid, eventName, location, date)
    for (i=0; i < attendees.length; i++) {
        addEventRegistered(pool, eid, attendees[i])
    }
    res.send({
        "code": 200,
        "status": "success"
    })
})

// API call to create a playlist
app.post(`/api/v1/create_playlist`, jsonParser,(req, res) => {

    var eid = req.body.eid;
    var pid = req.body.pid;
    var songs = req.body.songs;
    var uid = req.body.uid;
    var name = req.body.name;
    var check = `SELECT pid FROM Playlist WHERE pid = '${pid}'`;
    var checkStatus = pool.query(check).then((checkStatus) => {if (checkStatus.recordset.length >= 1) {
        console.log(songs);
        removePlaylistSongs(pool, pid);
        for (var i = 0; i < songs.length; i++) {
            
            addSong(pool, songs[i].id, songs[i].title, songs[i].artists, songs[i].album, songs[i].id)
            addPlaylistSongs(pool, pid, songs[i].id)
        }
    } else {
        console.log("PlaylistID: " + pid)
        console.log(songs)
        addPlaylist(pool, pid, uid, name);
        for (i=0; i < songs.length; i++){
            console.log("songID: " + songs[i].id)
            addSong(pool, songs[i].id, songs[i].title, songs[i].artists, songs[i].album, songs[i].id);
            addPlaylistSongs(pool, pid, songs[i].id);
        }

        addEventPlaylist(pool, eid, pid);
    }})
    

    res.send({
        "code": 200,
        "status": "success"
    })
})


app.get('/api/v1/view_playlist/', jsonParser, (req, res) => {
    var uid = req.query.uid;
    var pid = req.query.pid;
    var querystring = `SELECT * from Playlist where uid = '${uid}'`
    // var querystring = `SELECT Users.username, Playlist.name, Playlist.date, Playlist.pid FROM Users RIGHT JOIN Playlist ON Users.uid = '${uid}'`
    var result = pool.query(querystring).then((result) => res.send(result.recordset))
})

app.get('/api/v1/view_event_users', jsonParser, (req, res) => {
    var eid = req.query.eid;
    var eventUserQString = `SELECT Users.username from Event_Registered RIGHT JOIN Users on Event_Registered.eid = '${eid}'`
    var eventUsers = pool.query(eventUserQString).then((eventUsers) => {res.send(eventUsers.recordset)})
    
})

app.get('/api/v1/view_event_playlist', jsonParser, (req, res) => {
    var eid = req.query.eid;
    console.log("EventID: " + eid)
    var playlistQString = `SELECT pid FROM Playlist WHERE pid IN (SELECT pid FROM Event_Playlist WHERE eid = '${eid}')`
    var playlistEvent = pool.query(playlistQString).then((playlistEvent) => {res.send(playlistEvent.recordset)})
    
})

app.get('/api/v1/view_playlist_songs', jsonParser, (req, res) => {
    var pid = req.query.pid;
    var querystring = `SELECT * FROM Song WHERE sid IN (SELECT sid FROM Playlist_Songs where pid = '${pid}')`
    // var querystring = `SELECT Song.title, Song.artist FROM Song LEFT JOIN Playlist_Songs ON Playlist_Songs.pid = '${pid}'`
    var result = pool.query(querystring).then((result) => res.send(result.recordset));
})

app.post('/api/v1/add_song', jsonParser, (req, res) => {
    var pid = req.query.pid;
    var title = req.query.title;
    var artist = req.query.artist;
    var album = req.query.album;
    var uri = req.query.uri;
    var sid = addSong(pool, uri, title, artist, album, uri)
    //addPlaylistSongs(pool, pid, sid)
    res.send({
        "code": 200,
        "status": "success"
    })
})
app.post('/api/v1/edit_playlist_name', jsonParser, (req, res) => {
    var pid = req.query.pid;
    var name = req.query.name;
    var querystring = `UPDATE Playlist SET name = '${name}'`

})

app.delete('/api/v1/delete_playlist', jsonParser, (req, res) => {
    var pid = req.query.pid;
    removePlaylist(pool, pid)
    removePlaylistSongs(pool, pid)
    res.send({
        "code": 200,
        "status": "success"
    })
})

app.post(`/api/v1/add_user_songs`, jsonParser,(req, res) => {
    var sid = req.body.sid;
    var songs = req.body.songs;
    var uid = req.body.uid;
    console.log(songs)
    for (i=0; i < songs.length; i++){
        addSong(pool,songs[i].sid, songs[i].title, songs[i].artists, songs[i].album, songs[i].sid);
        addUserSong(pool, uid, songs[i].sid, songs[i].sid);
    }
    res.send({
        "code": 200,
        "status": "success"
    })
})

app.get('/api/v1/get_users', jsonParser, (req, res) => {
    var querystring = `SELECT username FROM Users`
    var result = pool.query(querystring).then((result) => res.send(result.recordset));
})

app.get('/api/v1/get_top_songs', jsonParser, (req, res) => {
    var users = req.query.users;
    var eventUserQString = `SELECT * FROM Song WHERE uri in (select uri from User_song where uid in( SELECT uid from Users where username = ('${users}')))`
    console.log(eventUserQString)
    var eventUsers = pool.query(eventUserQString).then((eventUsers) => {res.send(eventUsers.recordset)})
    
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
