import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class WeatherQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'lat must be a valid number' })
  lat?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'lon must be a valid number' })
  lon?: string;

  @IsOptional()
  @IsIn(['standard', 'metric', 'imperial'], {
    message: 'units must be one of: standard, metric, imperial',
  })
  units?: 'standard' | 'metric' | 'imperial';

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.split(',').filter(Boolean).join(','))
  exclude?: string;
}
