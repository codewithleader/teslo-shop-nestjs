import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // Transformar la data
  @Type(() => Number) // enableImplicitCorversions: true
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number) // enableImplicitCorversions: true
  offset?: number;
}
