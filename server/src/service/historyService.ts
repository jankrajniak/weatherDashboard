//Import native packages
import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';


// Define a City class with name and id properties

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// Complete the HistoryService class
class HistoryService {
  // Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf-8',});
    return data;
  }
  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }
  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    let parsedCities: City[];

    try {
      parsedCities = [].concat(JSON.parse(data));
    } catch (err) {
      parsedCities = [];
    }

    return parsedCities;
  }  
  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('City name is required');
    }

    const newCity = new City(city, uuidv4());
  
    const cities = await this.getCities();
    let newCities: City[];
   
    if (!cities.find((arrayCity) => arrayCity.name === city)) {   
      newCities = [...cities, newCity];
    } else {
      newCities = [...cities];
    }

    await this.write(newCities);
  }
  // Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    if (!id) {
      throw new Error ('City ID is required');
    }

    const cities = await this.getCities();

    const filteredCities = cities.filter((arrayCity) =>  arrayCity.id !== id);

    await this.write(filteredCities);
  }
}

export default new HistoryService();
