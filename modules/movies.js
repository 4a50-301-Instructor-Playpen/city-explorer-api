'use strict'
const axios = require('axios');

module.exports = getMovies;

function getMovies(cityName) {
  console.log('cityname', cityName);
  const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;
  //console.log('Movie API URL:', movieURL);
  let movieResp = axios.get(movieURL)
    .then(mv => {
      //console.log('mv:', mv)
      let parsed = parseMovieData(mv);
      console.log(`mvParsed: ${parsed}`);
      return parsed;
    })
    .catch(e => console.log('Error in requesting movies:', e));
  return movieResp;
}

function parseMovieData(mvArr) {
  try {
    console.log('mvArr:', mvArr.data.results.length);
    let mvArrObj = mvArr.data.results.map(m => {
      if (!m.overview) m.overview = 'No OverviewProvided';
      if (!m.poster_path) m.poster_path = 'https://via.placeholder.com/200'
      return new Movie(m)
    });
    //console.log('mvObj', mvArrObj);
    return Promise.resolve(mvArrObj);
  }
  catch (e) {
    return Promise.reject.e;
  }
}
class Movie {
  constructor(movie) {
    this.title = movie.title
    this.overview = movie.overview
    this.average_votes = movie.vote_average
    this.total_votes = movie.vote_count
    this.image_url = `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    this.popularity = movie.popularity
    this.released_on = movie.release_date
  }
}