'use strict'
const axios = require('axios');

module.exports = getMovies;

function getMovies(cityName) {
  const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;
  //console.log('Movie API URL:', movieURL);
  let movieResp = axios.get(movieURL)
    .then(mv => {
      return parseMovieData(mv);
    })
    .catch(e => console.log('Error in requesting movies:', e));
  return movieResp;
}

function parseMovieData(mvArr) {
  try {
    let mvArrObj = mvArr.data.results.map(m => { return new Movie(m) });
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