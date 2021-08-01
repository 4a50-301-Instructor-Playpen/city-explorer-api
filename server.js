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
const PORT = process.env.PORT || 3001; //value: 3000

const weatherData = require('./data/weather.json');



//routing '/' is refeerred to an endpoint
app.get('/', (req, res) => {
  res.send('Hello from the home route!');
});
app.get('/weather', getWeather);

async function getWeather(req, res) {
  console.log(req.query)
  try {
    //make an obj for the search Q
    let { searchQuery, lat, lon } = req.query;
    if (!searchQuery) searchQuery = 'No City';
    //can use city or lat/long pair
    console.log(`req.query: ${req.query}`);
    console.log(`Search Query: ${searchQuery} ${lat} ${lon}`, `API: ${process.env.WEATHERBIT_API_KEY}`);

    const weatherbitUrl = `https://api.weatherbit.io/v2.0//forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}`;
    console.log(weatherbitUrl);
    //axios.get API Call to the actualy WeatherBit API
    let weatherResponse = await axios.get(weatherbitUrl);
    //Put the data into an array
    let returnData = weatherResponse.data.data.map((item) => {
      return new Forecast(item);
    });
    //send it along with a 200
    res.status(200).send(returnData);

  }
  catch (e) {
    console.log(e);
    res.status(e.status).send({ status: e.status, description: `Unable to Process Request.  Query String Correct? ${e.message}` });
  }
}

//listening
app.listen(PORT, () => console.log(`listening on ${PORT}`));