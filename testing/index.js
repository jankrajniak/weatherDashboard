const city = 'Dunnellon';
const state = 'Florida';
const place = `${city},${state}`;
const cityLimit = '1';
const apiKey = `91c2caef54da1caed02907eac6df2b7d`;
const exclusions = '&exclude=minutely,hourly,alerts';
const units = '&units=imperial';


class Weather {
    city;
    date;
    icon;
    iconDescription;
    tempF;
    windSpeed;
    humidity;
  
    constructor (city, date, icon, iconDescription, tempF, windSpeed, humidity)
     {
      this.city = city;
      this.date = date;
      this.icon = icon;
      this.iconDescription = iconDescription;
      this.tempF = tempF;
      this.windSpeed = windSpeed;
      this.humidity = humidity;
    }
  }



const getWeather = async() => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=${cityLimit}&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);
    const latitude = data[0].lat;
    const longitude = data[0].lon;
    const requestMessage = (`http://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}${exclusions}${units}&appid=${apiKey}`);
    // console.log(requestMessage);
    const response2 = await fetch(requestMessage);
    const data2 = await response2.json();
    // console.log(data2);
    // console.log(data2.daily[0].temp);
    const date = new Date(data2.current.dt*1000);
    // console.log(date.toLocaleString().split(",")[0]);
    // console.log(data2.current.temp);
    // console.log(data2.current.weather[0].description);
    // console.log(data2.current.weather[0].icon);
    // console.log(data2.current.humidity);
    // console.log(data2.current.wind_speed);

    const newWeather = new Weather(city, date.toLocaleString().split(",")[0], data2.current.weather[0].icon, data2.current.weather[0].description, data2.current.temp, data2.current.wind_speed, data2.current.humidity);
    // console.log(newWeather);
    // console.log(data2.daily);
    
    const forecastSummary = [];
    
    for (const forecast of data2.daily) {
            const newForecast = new Weather(city, new Date(forecast.dt*1000).toLocaleString().split(',')[0], forecast.weather[0].icon, forecast.weather[0].description, forecast.temp.day, forecast.wind_speed, forecast.humidity);
            forecastSummary.push(newForecast);
        }

    const weatherResponse = [].concat(newWeather, forecastSummary.slice(1,6));
    console.log(weatherResponse);
}


getWeather();







// fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=${cityLimit}&appid=${apiKey}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data)
//         const latitude = data[0].lat;
//         const longitude = data[0].lon;
//         console.log(latitude, longitude);
//         const requestMessage = (`http://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}${exlucison}${units}&appid=${apiKey}`)
//         console.log(requestMessage);
//         return fetch(requestMessage)})
//         .then(response => response.json())
//         .then(data => console.log(data));
