'use strict'
const axios = require('axios');
module.exports = getWeather;

function getWeather(lat, lon) {
  const weatherbitUrl = `https://api.weatherbit.io/v2.0//forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}`;

  console.log('URL: ', weatherbitUrl);

  let weatherResponse = axios.get(weatherbitUrl)
    .then(wd => parseData(wd.data.data))
    .catch((e) => console.log('ERROR FOUND: ', e.message));

  return weatherResponse;

}
function parseData(weather) {
  try {
    //console.log('PARSE_DATA: ' + weather)
    let result = weather.map(item => { return new Forecast(item) });
    //console.log(result)
    return Promise.resolve(result);
  }
  catch (e) {
    return Promise.reject(e);
  }
}
class Forecast {
  constructor(weatherDay) {
    this.date = weatherDay.datetime;
    //Low of 17.5, high of 29.9 with few clouds
    this.description = `Low of ${weatherDay.low_temp}, high of ${weatherDay.high_temp} with ${weatherDay.weather.description}`;
  }
}