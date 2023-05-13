import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entities
import { Product, ProductImage } from './entities';
// Data Transfer Object (DTO's)
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
// Utils
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product) // Introducimos la entidad "Product"
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(product); // Guarda el product en DB

      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // todo: paginación
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    // Aplanamos las images para que enviar toda la info sinó solo la url:
    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      // SELECT * FROM products WHERE slug='abc' or title='abc'
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(), // Con el UPPER(title) convertimos a mayúscula el titulo en db para luego compararlo con el termino.toUpperCase y asi si el termino viene en minusculas o en mayúsculas simpre estará en mayúsculas al momento de hacer la comparación en la busqueda.
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne(); // "getOne" solo devulve un solo product si el where llega a devolver varios
      // El where puede conseguir varios en el caso que tanto el title como el slug den positivo en la busqueda
    }

    if (!product) {
      throw new NotFoundException(
        `Product with search term: ${term} Not Found`,
      );
    }

    return product;
  }

  // Metodo para aplanar las images para no enviar toda la info sinó solo la url
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map((img) => img.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id, // Buscate un producto con este id
      ...updateProductDto, // y lo preparas para actualizar estos campos
      images: [],
    });

    if (!product) {
      throw new NotFoundException(`Produt with id: ${id} not found`);
    }

    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    // No hay que comprobar si existe porque ya el método findOne ya lanza una exception si no existe

    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
