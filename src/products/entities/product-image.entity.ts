import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn() // El valor por defecto es 'increment' para autoincrementar
  id: number;

  @Column('text')
  url: string;
}
