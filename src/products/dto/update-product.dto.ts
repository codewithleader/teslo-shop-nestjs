// import { PartialType } from '@nestjs/mapped-types'; // Para la documentación se reemplaza por el de Swagger
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
