'use strict'
class Forecast {
  constructor(weatherDay) {
    this.date = weatherDay.datetime;
    //Low of 17.5, high of 29.9 with few clouds
    this.description = `Low of ${weatherDay.low_temp}, high of ${weatherDay.high_temp} with ${weatherDay.weather.description}`;
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.title
    this.overview = movie.overview
    this.average_votes = movie.vote_average
    this.total_votes = movie.vote_count
    this.image_url = movie.poster_path
    this.popularity = movie.popularity
    this.released_on = movie.release_date
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

//routing '/' is refeerred to an endpoint
app.get('/', (req, res) => {
  res.send('Hello from the home route!');
});
app.get('/weather', getWeather);
app.get('/movies', getMovies)

async function getMovies(req, res) {
  let returnArr = [];
  let { city_name } = req.query;
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city_name}`;
  try {
    let movieApiData = await axios.get(movieUrl)
    console.log(movieApiData.data.results[0], movieApiData.data.results.length);
    movieApiData.data.results.map(item => returnArr.push(new Movie(item)));
    res.status(400).send(returnArr);
  }
  catch (error) {
    res.status(400)
    if (error.status) res.status(error.status)
    res.send(error.message)
  }

}

async function getWeather(req, res) {
  try {
    //make an obj for the search Q
    let { searchQuery, lat, lon } = req.query;
    if (!searchQuery) searchQuery = 'No City';
    //can use city or lat/long pair    
    const weatherbitUrl = `https://api.weatherbit.io/v2.0//forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}`;
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