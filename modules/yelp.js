'use strict';

let cache = require('./cache.js');
const axios = require('axios');

module.exports = getYelp;

function getYelp(searchQuery) {
  const key = 'yelp-' + searchQuery;
  const url = `https://api.yelp.com/v3/businesses/search?location=${searchQuery}&limit=10`
  console.log('URL:', url);

  if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url,
      { headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` } })
      .then(axObj => parseYelpRequest(axObj.data))
      .catch(err => Promise.reject(err))
  }

  return cache[key].data
}
function parseYelpRequest(axData) {
  try {
    const yelpArr = axData.businesses.map(b =>
      new Restaurants(b));
    return Promise.resolve(yelpArr)
  }
  catch (e) {
    return Promise.reject(e);
  }
}
class Restaurants {
  constructor(restaurant) {
    this.name = restaurant.name;
    this.image_url = restaurant.image_url;
    this.price = restaurant.price;
    this.rating = restaurant.rating;
    this.url = restaurant.url;
  }
}