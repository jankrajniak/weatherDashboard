// import fs from 'node:fs/promises';
import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object

class Weather {
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  city: string;

  constructor(
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    city: string
  ) {
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.city = city;
  }
}

// Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;


  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // Create fetchLocationData method
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const query:string = this.buildGeocodeQuery(city);
    const response:any = await fetch(query);
    const data:[{name:string, lat:number, lon:number, country:string,state: string}] = await response.json();
    return this.destructureLocationData(data);
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData : [{name:string, lat:number, lon:number, country:string,state: string}]): Coordinates {
    return {lat: locationData[0].lat, lon: locationData[0].lon};
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(city:string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }
  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const exclusions: string = '&exclude=minutely,hourly,alerts';
    const units: string ='&units=imperial';
    return `${this.baseURL}/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}${exclusions}${units}&appid=${this.apiKey}`;
  }
  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates, city: string): Promise<Weather[]>{
    const query:string = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    const currentWeather = this.parseCurrentWeather(data, city);
    const forecastArray = this.buildForecastArray(data, city);

    return [currentWeather, ...forecastArray];
    

  }
  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any, city: string): Weather {
    const date: string = new Date(response.current.dt*1000).toLocaleString().split(',')[0];
    const icon: string = response.current.weather[0].icon;
    const iconDescription: string = response.current.weather[0].description;
    const tempF: number = response.current.temp;
    const windSpeed: number = response.current.wind_speed;
    const humidity: number = response.current.humidity;

    return new Weather(date, icon, iconDescription, tempF, windSpeed, humidity, city);
  }

  // Complete buildForecastArray method
  private buildForecastArray(response: any, city: string): Weather[] {
    const forecastArray: Weather[] = [];

    for (const forecast of response.daily) {
      const date: string = new Date(forecast.dt*1000).toLocaleString().split(',')[0];
      const icon: string = forecast.weather[0].icon;
      const iconDescription: string = forecast.weather[0].description;
      const tempF: number = forecast.temp.day;
      const windSpeed: number = forecast.wind_speed;
      const humidity: number = forecast.humidity;
      const weather = new Weather(date, icon, iconDescription, tempF, windSpeed, humidity, city);
      forecastArray.push(weather);
    }
    return forecastArray.slice(1, 6);
  }


  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const locationData = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(locationData, city);
    return weatherData;
  
  }

}

export default new WeatherService();
