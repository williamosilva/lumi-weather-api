import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherResponse } from './interfaces';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getWeather(@Query() query: WeatherQueryDto): Promise<WeatherResponse> {
    return this.weatherService.getWeather(query);
  }
}
