import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity({ name: 'product-images' }) // con "name" Renombra columna de tabla en PostgreSQL
export class ProductImage {
  @PrimaryGeneratedColumn() // El valor por defecto es 'increment' para autoincrementar
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    //
    () => Product,
    (product) => product.images,
    { onDelete: 'CASCADE' },
  )
  product: Product;
}
