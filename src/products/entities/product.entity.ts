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
  @ApiProperty({
    example: '1962b1e4-2f56-48ce-baf4-34974904e556',
    description: 'Product ID',
    uniqueItems: true,
  }) // Documentation with Swagger
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: "Men's Solar Roof Tee",
    description: 'Product title',
    uniqueItems: true,
  }) // Documentation with Swagger
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  }) // Documentation with Swagger
  @Column('float', { default: 0 }) // "number" no es soportado por PostgreSQL. Decimales: "float"
  price: number;

  @ApiProperty({
    example:
      "Inspired by our fully integrated home solar and storage system, the Tesla Solar Roof Tee advocates for clean, sustainable energy wherever you go. Designed for fit, comfort and style, the tee features an aerial view of our seamless Solar Roof design on the front with our signature T logo above 'Solar Roof' on the back. Made from 100% Peruvian cotton.",
    description: 'Product description',
    default: null,
  }) // Documentation with Swagger
  @Column({ type: 'text', nullable: true }) // Otra sintaxis válida
  description: string;

  @ApiProperty({
    example: 'men_solar_roof_tee',
    description: 'Product SLUG - For SEO',
    uniqueItems: true,
  }) // Documentation with Swagger
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  }) // Documentation with Swagger
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Product sizes',
  }) // Documentation with Swagger
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'Men',
    description: 'Product gender',
  }) // Documentation with Swagger
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
