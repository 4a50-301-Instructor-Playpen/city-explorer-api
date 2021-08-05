'use strict'
class Forecast {
  constructor(weatherDay) {
    this.date = weatherDay.datetime;
    //Low of 17.5, high of 29.9 with few clouds
    this.description = `Low of ${weatherDay.low_temp}, high of ${weatherDay.high_temp} with ${weatherDay.weather.description}`;
  }
}


//Bring in the npm package 'express'
const express = require('express');

//initialize the express library
const app = express();

//This is going to access our .env
require('dotenv').config();

//Determine who can use the server.  Alway required (wont use now)
const cors = require('cors');

app.use(cors());

const axios = require('axios');

//getting the PORT from our env.
const PORT = process.env.PORT || 3001; //value: 3000\
const weather = require('./modules/weather');
const movies = require('./modules/movies');
//routing '/' is refeerred to an endpoint
app.get('/', (req, res) => {
  res.send('Hello from the home route!');
});
app.get('/weather', getWeatherModule);
app.get('/movies', getMovieModule);

async function getMovieModule(req, res) {
  let { city_name } = req.query;
  console.log(city_name);
  try {
    movies(city_name)
      .then(data => {
        console.log('movieData:', data);
        res.send(data);
      })
      .catch(e => console.log('Movie Server Error:', e));
  }
  catch (error) {
    res.send(error.message);
  }

}
function getWeatherModule(req, res) {
  try {
    let { lat, lon } = req.query;
    console.log('getWeatherModule');
    try {
      weather(lat, lon)
        .then(datastuff => res.send(datastuff))
        .catch((e => console.log(e))
        )
      //console.log(response);
    }
    catch {
      res.send('error');
    }


  }
  catch { }

}

//listening
app.listen(PORT, () => console.log(`listening on ${PORT}`));