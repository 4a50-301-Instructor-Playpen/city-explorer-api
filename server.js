'use strict';

require('dotenv');
const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors());

const weather = require('./modules/weather.js');
const movies = require('./modules/movies.js');
const yelp = require('./modules/yelp');


app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);
app.get('/yelp', yelpHandler);

function yelpHandler(req, res) {
  const { searchQuery } = req.query;
  yelp(searchQuery)
    .then(data => res.send(data))
    .catch(err => res.send(err));
}

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!:', error)
    });
}
async function movieHandler(req, res) {
  let { city_name } = req.query;
  movies(city_name.toUpperCase())
    .then(data => res.send(data))
    .catch(err => console.log(`Error retrieving movies: ${err}`));

}
app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));