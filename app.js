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

//GET to show a single artist/song
app.get('/api/edit/:id/edit', (req,res) => {
    const artists = getArtists();
    const artist = artists.find(artist => artist.id == req.params.id);
    const songs = getSongs();
    const song = songs.find(song => song.id == req.params.id);
    res.render('edit', { artist, song });
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

//PUT to update artist/song
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
app.post('/api/edit/:id/delete', (req,res) => {
    let artists = getArtists();
    artists = artists.filter(artist => artist.id != req.params.id);
    saveArtists(artists);
    let songs = getSongs();
    songs = songs.filter(song => song.id != req.params.id);
    saveSongs(songs);
    res.redirect('/api/admin');
});

//api to return all artists
app.get('/api/artists', (req, res) => {
    const artists = getArtists();
    const newArtists = artists.map(artist => {
        const {id, name, albums} = artist;
        return {id, name, albums};
    })
    res.json(newArtists);
})

//api to return all songs
app.get('/api/songs', (req, res) => {
    const songs = getSongs();
    const newSongs = songs.map(song => {
        const {id, name, most_popular_song, release_year} = song;
        return {id, name, most_popular_song, release_year};
    })
    res.json(newSongs);
})

//query to get number of albums and/or name of artist under all artists
app.get('/api/artists/query', (req, res) => {
    const artists = getArtists();
    const {nameSearch, albums} = req.query
    let sortedArtists = [...artists]

    if(nameSearch){
        sortedArtists = sortedArtists.filter((artist) => {
            return artist.name.toLowerCase().includes(nameSearch.toLowerCase());
        })
    }   
    if(albums){
        sortedArtists = sortedArtists.filter((artist) => {
            return artist.albums == Number(albums);
        })
    }
    if(sortedArtists.length < 1){
        return res.status(200).json("No results matching your query")
    }
    res.status(200).json(sortedArtists)
})

//query for finding release dates and band/artist name, song name, and release year under songs
app.get('/api/songs/query', (req, res) => {
    const songs = getSongs();
    const {nameSearch, songName, year} = req.query
    let sortedSongs = [...songs]

    if(nameSearch){
        sortedSongs = sortedSongs.filter((song) => {
            return song.name.toLowerCase().includes(nameSearch.toLowerCase());
        })
    }
    if(songName){
        sortedSongs = sortedSongs.filter((song) => {
            return song.most_popular_song.toLowerCase().includes(songName.toLowerCase());
        });
    }
    if(year){
        sortedSongs = sortedSongs.filter((song) => {
            return Number(song.release_year) === Number(year);
        });
    }
    if(sortedSongs.length < 1){
        return res.status(200).json("No results matching your query")
    }
    res.status(200).json(sortedSongs)
})

//query for finding artistID
app.get('/api/artists/:artistID', (req, res) => {
    const artists = getArtists();
    const {artistID} = req.params;
    const singleArtist = artists.find(artist => artist.id === Number(artistID));

    if(!singleArtist){
        return res.status(404).send('No artist matching this ID')
    }
    return res.json(singleArtist)
})

//query for finding songID
app.get('/api/songs/:songID', (req, res) => {
    const songs = getSongs();
    const {songID} = req.params;
    const singleSong = songs.find(song => song.id === Number(songID));

    if(!singleSong){
        return res.status(404).send('No song matching this ID')
    }
    return res.json(singleSong)
})

//server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});