//libraries
var express = require('express');
var app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const PORT = 3000;

//public folder css and middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

//functions to save and get events
const getArtists = () => {
    const data = fs.readFileSync('./db/artists.json','utf8');
    return JSON.parse(data);
};

const saveArtists = (events) => {
    fs.writeFileSync('./db/artists.json', JSON.stringify(events, null, 2));
};

//functions to save and get registrations
const getSongs = () => {
    const data = fs.readFileSync('./db/songs.json','utf8');
    return JSON.parse(data);
};

const saveSongs = (registers) => {
    fs.writeFileSync('./db/songs.json', JSON.stringify(registers, null, 2));
};

//routes

// //index page
// app.get('/', (req,res) => {
//     const registers = getRegister();
//     const events = getEvents();
//     res.render('pages/index', { events, registers } );
// });

// //register page
// app.get('/register', (req,res) => {
//     const registers = getRegister();
//     const events = getEvents();
//     res.render('pages/register', { events, registers } );
// });

// //POST
// //adds event to the events.json
// app.post('/events', (req,res) => {
//     const events = getEvents();
//     const newEvent = {
//         id: events.length+1,
//         name:req.body.name,
//         date:req.body.date,
//         description:req.body.description,
//         attendees:0,
//     };
//     events.push(newEvent);
//     saveEvents(events);
//     res.redirect('/');
// })
// //adds person who registered to registrations.json
// app.post('/submit', (req,res) => {
//     const registers = getRegister();
//     const newRegister = {
//         id: registers.length+1,
//         name:req.body.name,
//         email:req.body.email,
//     };
//     registers.push(newRegister);
//     saveRegister(registers);
//     res.redirect('/register');
// })

// //GET to show a single event
// app.get('/events/:id/edit', (req,res) => {
//     const events = getEvents();
//     const event = events.find(event => event.id == req.params.id);
//     res.render('pages/events', { event });
// });

// //PUT to update event
// app.post('/events/:id', (req,res) => {
//     const events = getEvents();
//     const eventIndex = events.findIndex(event => event.id == req.params.id);
//     events[eventIndex].description = req.body.description;
//     events[eventIndex].name = req.body.name;
//     events[eventIndex].date = req.body.date;
//     saveEvents(events);
//     res.redirect('/');
// });

// //DELETE
// app.post('/events/:id/delete', (req,res) => {
//     let events = getEvents();
//     events = events.filter(event => event.id != req.params.id);
//     saveEvents(events);
//     res.redirect('/');
// });

//server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});