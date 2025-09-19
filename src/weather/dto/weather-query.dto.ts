import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherQueryDto {
  @ApiProperty({
    description: 'Latitude da localização',
    example: '-23.2927',
    required: false,
    type: String,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @IsNumberString({}, { message: 'lat deve ser um número válido' })
  lat?: string;

  @ApiProperty({
    description: 'Longitude da localização',
    example: '-51.1732',
    required: false,
    type: String,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @IsNumberString({}, { message: 'lon deve ser um número válido' })
  lon?: string;

  @ApiProperty({
    description: 'Unidade de medida para temperatura',
    enum: ['standard', 'metric', 'imperial'],
    example: 'metric',
    required: false,
    enumName: 'UnitsEnum',
  })
  @IsOptional()
  @IsIn(['standard', 'metric', 'imperial'], {
    message: 'units deve ser: standard, metric ou imperial',
  })
  units?: 'standard' | 'metric' | 'imperial';

  @ApiProperty({
    description: 'Código do idioma para descrições (ex: pt_br, en, es)',
    example: 'pt_br',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  lang?: string;

  @ApiProperty({
    description: 'Partes da resposta a excluir (separadas por vírgula)',
    example: 'minutely,hourly',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.split(',').filter(Boolean).join(','))
  exclude?: string;
}
