import { ApiProperty } from '@nestjs/swagger';

export class WeatherCondition {
  @ApiProperty({
    description: 'ID da condição meteorológica',
    example: 800,
  })
  id: number;

  @ApiProperty({
    description: 'Grupo principal da condição',
    example: 'Clear',
  })
  main: string;

  @ApiProperty({
    description: 'Descrição da condição meteorológica',
    example: 'céu limpo',
  })
  description: string;

  @ApiProperty({
    description: 'Ícone da condição meteorológica',
    example: '01d',
  })
  icon: string;
}

export class CurrentWeather {
  @ApiProperty({
    description: 'Temperatura atual',
    example: 25.6,
  })
  temp: number;

  @ApiProperty({
    description: 'Sensação térmica',
    example: 27.8,
  })
  feels_like: number;

  @ApiProperty({
    description: 'Umidade relativa (%)',
    example: 65,
  })
  humidity: number;

  @ApiProperty({
    description: 'Pressão atmosférica (hPa)',
    example: 1013,
  })
  pressure: number;

  @ApiProperty({
    description: 'Velocidade do vento (m/s)',
    example: 3.2,
  })
  wind_speed: number;

  @ApiProperty({
    description: 'Condições meteorológicas',
    type: [WeatherCondition],
  })
  weather: WeatherCondition[];
}

export class DailyTemperature {
  @ApiProperty({
    description: 'Temperatura mínima do dia',
    example: 18.5,
  })
  min: number;

  @ApiProperty({
    description: 'Temperatura máxima do dia',
    example: 28.3,
  })
  max: number;
}

export class DailyWeather {
  @ApiProperty({
    description: 'Timestamp Unix da data',
    example: 1704067200,
  })
  dt: number;

  @ApiProperty({
    description: 'Temperaturas do dia',
    type: DailyTemperature,
  })
  temp: DailyTemperature;

  @ApiProperty({
    description: 'Condições meteorológicas',
    type: [WeatherCondition],
  })
  weather: WeatherCondition[];
}

export class WeatherResponse {
  @ApiProperty({
    description: 'Latitude da localização',
    example: -23.2927,
  })
  lat: number;

  @ApiProperty({
    description: 'Longitude da localização',
    example: -51.1732,
  })
  lon: number;

  @ApiProperty({
    description: 'Fuso horário da localização',
    example: 'America/Sao_Paulo',
  })
  timezone: string;

  @ApiProperty({
    description: 'Condições meteorológicas atuais',
    type: CurrentWeather,
  })
  current: CurrentWeather;

  @ApiProperty({
    description: 'Previsão diária (7 dias)',
    type: [DailyWeather],
  })
  daily: DailyWeather[];
}

export interface OpenWeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeatherFull;
  daily: DailyWeatherFull[];
}

export interface CurrentWeatherFull {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
}

export interface DailyTemp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface DailyFeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

export interface DailyWeatherFull {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: DailyTemp;
  feels_like: DailyFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}
