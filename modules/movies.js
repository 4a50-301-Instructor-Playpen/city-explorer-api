'use strict'
const axios = require('axios');
let cache = require('./cache.js');
module.exports = getMovies;

function getMovies(cityName) {

  const key = 'movies-' + cityName;
  const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;
  if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 20)) {
    console.log('cache hit');
  } else {
    console.log('cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(movieURL)
      .then(mv => parseMovieData(mv))
      .catch(e => console.log('Error in requesting movies:', e));
  }
  return cache[key].data;
}

function parseMovieData(mvArr) {
  try {
    let mvArrObj = mvArr.data.results.map(m => {
      if (!m.overview) m.overview = 'No OverviewProvided';
      (!m.poster_path) ? m.poster_path = 'https://via.placeholder.com/200' : m.poster_path = `https://image.tmdb.org/t/p/w200${m.poster_path}`
      return new Movie(m)
    });
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
    this.image_url = movie.poster_path
    this.popularity = movie.popularity
    this.released_on = movie.release_date
  }
}