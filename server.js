'use strict';

require('dotenv');
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const movies = require('./modules/movies.js')
const app = express();

require('dotenv').config();
app.use(cors());

app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!')
    });
}
async function movieHandler(req, res) {
  let { city_name } = req.query;
  movies(city_name.toUpperCase())
    .then(data => res.send(data))
    .catch(err => console.log(`Error retrieving movies: ${err}`));

}
app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));