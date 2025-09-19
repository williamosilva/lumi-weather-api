import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { OpenWeatherResponse, WeatherResponse } from './interfaces';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly defaultLat: number;
  private readonly defaultLon: number;
  private readonly defaultUnits: string;
  private readonly defaultLang: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENWEATHER_API_KEY is required');
    }

    this.apiKey = apiKey;
    this.defaultLat = parseFloat(
      this.configService.get<string>('DEFAULT_LAT') || '-23.2927',
    );
    this.defaultLon = parseFloat(
      this.configService.get<string>('DEFAULT_LON') || '-51.1732',
    );
    this.defaultUnits =
      this.configService.get<string>('DEFAULT_UNITS') || 'metric';
    this.defaultLang = this.configService.get<string>('DEFAULT_LANG') || 'pt';
  }

  async getWeather(query: WeatherQueryDto): Promise<WeatherResponse> {
    const lat = query.lat ? parseFloat(query.lat) : this.defaultLat;
    const lon = query.lon ? parseFloat(query.lon) : this.defaultLon;
    const units = query.units || this.defaultUnits;
    const lang = query.lang || this.defaultLang;
    const exclude = query.exclude || '';

    this.validateCoordinates(lat, lon);

    try {
      const url = 'https://api.openweathermap.org/data/3.0/onecall';
      const params = {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
        units,
        lang,
        ...(exclude && { exclude }),
      };

      this.logger.debug(
        `Fetching weather data for coordinates: ${lat}, ${lon}`,
      );

      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherResponse>(url, { params }),
      );

      return this.transformResponse(response.data);
    } catch (error) {
      this.handleApiError(error);
    }
  }

  private validateCoordinates(lat: number, lon: number): void {
    if (isNaN(lat) || isNaN(lon)) {
      throw new BadRequestException('Invalid latitude or longitude');
    }

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    if (lon < -180 || lon > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }
  }

  private transformResponse(data: OpenWeatherResponse): WeatherResponse {
    return {
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
      current: {
        temp: data.current.temp,
        feels_like: data.current.feels_like,
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        wind_speed: data.current.wind_speed,
        weather: data.current.weather,
      },
      daily: data.daily.slice(0, 7).map((day) => ({
        dt: day.dt,
        temp: {
          min: day.temp.min,
          max: day.temp.max,
        },
        weather: day.weather,
      })),
    };
  }

  private handleApiError(error: any): never {
    if (error.response?.status) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Unknown error';

      this.logger.error(`OpenWeather API error: ${status} - ${message}`);

      switch (status) {
        case 400:
          throw new BadRequestException(`Invalid request: ${message}`);
        case 401:
          throw new BadRequestException('Invalid API key');
        case 404:
          throw new BadRequestException('Location not found');
        case 429:
          throw new BadRequestException('API rate limit exceeded');
        default:
          throw new InternalServerErrorException(
            `Weather service error: ${message}`,
          );
      }
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      this.logger.error('Network error accessing OpenWeather API');
      throw new InternalServerErrorException(
        'Unable to connect to weather service',
      );
    }

    this.logger.error(`Unexpected error: ${error.message}`);
    throw new InternalServerErrorException('Internal server error');
  }
}
