import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

// ..............................

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'How many rows do you need',
  }) // Documentation with Swagger
  @IsOptional()
  @IsPositive()
  // Transformar la data a number porque viene en string
  @Type(() => Number) // enableImplicitCorversions: true
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many rows do you want to skip',
  }) // Documentation with Swagger
  @IsOptional()
  @Min(0)
  // Transformar la data a number porque viene en string
  @Type(() => Number) // enableImplicitCorversions: true
  offset?: number;
}
