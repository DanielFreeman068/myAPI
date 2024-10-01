//libraries
var express = require('express');
var app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const PORT = 5100;

//public folder css and middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

//functions to save and get artists
const getArtists = () => {
    const data = fs.readFileSync('./db/artists.json','utf8');
    return JSON.parse(data);
};

const saveArtists = (artists) => {
    fs.writeFileSync('./db/artists.json', JSON.stringify(artists, null, 2));
};

//functions to save and get songs
const getSongs = () => {
    const data = fs.readFileSync('./db/songs.json','utf8');
    return JSON.parse(data);
};

const saveSongs = (songs) => {
    fs.writeFileSync('./db/songs.json', JSON.stringify(songs, null, 2));
};

//routes

//index page
app.get('/api/', (req,res) => {
    const songs = getSongs();
    const artists = getArtists();
    res.render('index', { artists, songs } );
});

//admin page
app.get('/api/admin', (req,res) => {
    const songs = getSongs();
    const artists = getArtists();
    res.render('admin', { artists, songs } );
});

//POST
//adds data to the artists.json and songs.json
app.post('/addArtist', (req,res) => {
    const artists = getArtists();
    const songs = getSongs();
    const newArtist = {
        id: artists.length+1,
        name:req.body.name,
        albums:req.body.albums
    };
    const newSong = {
        id:songs.length+1,
        name:req.body.name,
        most_popular_song:req.body.best_song,
        release_year:req.body.release_year
    }
    artists.push(newArtist);
    songs.push(newSong)
    saveArtists(artists);
    saveSongs(songs);
    res.redirect('/api/admin');
});

//GET to show a single event
app.get('/edit/:id/edit', (req,res) => {
    const artists = getArtists();
    const artist = artists.find(artist => artist.id == req.params.id);
    const songs = getSongs();
    const song = songs.find(song => song.id == req.params.id);
    res.render('edit', { artist, song });
});

//PUT to update event
app.post('/artists/:id', (req,res) => {
    const artists = getArtists();
    const artistIndex = artists.findIndex(artist => artist.id == req.params.id);
    artists[artistIndex].name = req.body.name;
    artists[artistIndex].albums = req.body.albums;
    saveArtists(artists);
    const songs = getSongs();
    const songIndex = songs.findIndex(song => song.id == req.params.id);
    songs[songIndex].most_popular_song = req.body.best_song;
    songs[songIndex].release_year = req.body.release_year;
    saveSongs(songs);
    res.redirect('/api/admin');
});

//DELETE
app.post('/edit/:id/delete', (req,res) => {
    let artists = getArtists();
    artists = artists.filter(artist => artist.id != req.params.id);
    saveArtists(artists);
    let songs = getSongs();
    songs = songs.filter(song => song.id != req.params.id);
    saveSongs(songs);
    res.redirect('/api/admin');
});

//server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});