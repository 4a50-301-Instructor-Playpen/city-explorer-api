'use strict'
class Forecast {
  constructor(weatherDay) {
    this.date = weatherDay.datetime;
    //Low of 17.5, high of 29.9 with few clouds
    this.description = `Low of ${weatherDay.low_temp}, high of ${weatherDay.high_temp} with ${weatherDay.weather.description}}`;
  }
}

//This is going to access our .env
require('dotenv').config();


//Bring in the npm package 'express'
const express = require('express');

//initialize the express library
const app = express();

//Determine who can use the server.  Alway required (wont use now)
const cors = require('cors');


//getting the PORT from our env.
const PORT = process.env.PORT || 3001; //value: 3000

const weatherData = require('./data/weather.json');

app.lister

//routing '/' is refeerred to an endpoint
app.get('/', (req, res) => {
  res.send('Hello from the home route!');
});
app.get('/weather', getWeather);

function getWeather(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.query)
  try {
    //make an obj for the search Q
    let { searchQuery, lat, lon } = req.query;
    console.log('sq:', searchQuery);
    //can use city or lat/long pair
    let cityInfo = weatherData.find(e =>
      e.city_name.toLowerCase() === searchQuery.toLowerCase() ||
      (e.lat === lat && e.lon === lon)
    );
    if (!cityInfo) res.status(404).send('Unable to locate destination');
    let weatherArr = cityInfo.data.map(d => new Forecast(d));
    console.log(weatherArr);
    res.send(weatherArr);
  }
  catch (e) {

  }
}

//listening
app.listen(PORT, () => console.log(`listening on ${PORT}`));