import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherResponse, WeatherCondition } from './interfaces';

@ApiTags('weather')
@Controller('weather')
@ApiExtraModels(WeatherResponse, WeatherCondition)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter dados meteorológicos',
    description: `
    Retorna informações meteorológicas atuais e previsão de 7 dias para uma localização específica.
    
    Se latitude e longitude não forem fornecidas, será usado a localização padrão configurada no servidor.
    
    **Coordenadas padrão:** Londrina, Brasil (-23.2927, -51.1732)
    `,
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    type: String,
    description: 'Latitude da localização (-90 a 90)',
    example: '-23.2927',
  })
  @ApiQuery({
    name: 'lon',
    required: false,
    type: String,
    description: 'Longitude da localização (-180 a 180)',
    example: '-51.1732',
  })
  @ApiQuery({
    name: 'units',
    required: false,
    enum: ['standard', 'metric', 'imperial'],
    description: `
    Unidade de medida para temperatura:
    - **standard**: Kelvin (padrão)
    - **metric**: Celsius
    - **imperial**: Fahrenheit
    `,
    example: 'metric',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    type: String,
    description: `
    Idioma para descrição das condições meteorológicas.
    
    **Códigos suportados:** pt_br, en, es, fr, de, it, ja, zh_cn, etc.
    `,
    example: 'pt_br',
  })
  @ApiQuery({
    name: 'exclude',
    required: false,
    type: String,
    description: `
    Partes da resposta a serem excluídas (separadas por vírgula).
    
    **Opções:** current, minutely, hourly, daily, alerts
    `,
    example: 'minutely,hourly',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados meteorológicos obtidos com sucesso',
    type: WeatherResponse,
    schema: {
      example: {
        lat: -23.2927,
        lon: -51.1732,
        timezone: 'America/Sao_Paulo',
        current: {
          temp: 25.6,
          feels_like: 27.8,
          humidity: 65,
          pressure: 1013,
          wind_speed: 3.2,
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'céu limpo',
              icon: '01d',
            },
          ],
        },
        daily: [
          {
            dt: 1704067200,
            temp: {
              min: 18.5,
              max: 28.3,
            },
            weather: [
              {
                id: 800,
                main: 'Clear',
                description: 'céu limpo',
                icon: '01d',
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Latitude deve estar entre -90 e 90',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chave da API inválida',
    schema: {
      example: {
        statusCode: 401,
        message: 'Chave da API inválida',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Localização não encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Localização não encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Limite de requisições excedido',
    schema: {
      example: {
        statusCode: 429,
        message: 'Limite de requisições da API excedido',
        error: 'Too Many Requests',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    schema: {
      example: {
        statusCode: 500,
        message: 'Erro interno do servidor',
        error: 'Internal Server Error',
      },
    },
  })
  async getWeather(@Query() query: WeatherQueryDto): Promise<WeatherResponse> {
    return this.weatherService.getWeather(query);
  }
}
