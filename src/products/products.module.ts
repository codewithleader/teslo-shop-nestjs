import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { ProductsService } from './products.service';
// Controllers
import { ProductsController } from './products.controller';
// Entities
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
