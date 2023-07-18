import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './';
import { User } from 'src/auth/entities/user.entity';

// Entities (models) ...................

@Entity({ name: 'products' }) // con "name" Renombra columna de tabla en PostgreSQL
export class Product {
  @ApiProperty() // Documentation with Swagger
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty() // Documentation with Swagger
  @Column('text', { unique: true })
  title: string;

  @ApiProperty() // Documentation with Swagger
  @Column('float', { default: 0 }) // "number" no es soportado por PostgreSQL. Decimales: "float"
  price: number;

  @ApiProperty() // Documentation with Swagger
  @Column({ type: 'text', nullable: true }) // Otra sintaxis válida
  description: string;

  @ApiProperty() // Documentation with Swagger
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty() // Documentation with Swagger
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty() // Documentation with Swagger
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty() // Documentation with Swagger
  @Column('text')
  gender: string;

  @ApiProperty() // Documentation with Swagger
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty() // Documentation with Swagger
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(
    // Tipo de relación
    () => User, // Con quien se relaciona
    (user) => user.product, // en qué campo
    { eager: true }, // Carga automatica la relación del user (la info del usuario)
  )
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
