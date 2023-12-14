import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
//
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/auth/entities/user.entity';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    //
    private readonly productsService: ProductsService,

    //
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    // First: Delete all products
    await this.deleteTables();

    // Next: Create users
    const adminUser = await this.insertUsers();

    // Then: Create many products
    await this.insertNewProducts(adminUser);

    return 'Seed Execute';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      //
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
