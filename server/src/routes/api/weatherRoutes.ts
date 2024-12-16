import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.body.cityName) {
      res.status(400).json({message: 'City name is required'});
    }
    const cityName = req.body.cityName;
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    res.status(200).json(weatherData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
}});

// Get search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.status(200).json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  });


// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({message: 'City id is required'});
    }
    const id = req.params.id;
    await HistoryService.removeCity(id);
    res.status(200).json({success: 'City successfully removed from search history'});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
