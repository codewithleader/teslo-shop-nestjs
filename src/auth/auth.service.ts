import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
// bcrypt
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      }); // preparación

      await this.userRepository.save(user); // guardarlo

      // Eliminar el password para no devolver el password hasheado al usuario
      delete user.password;

      // todo: Retornar JWT de acceso

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // En el User Entity el password configuramos para que por defecto no se muestre en las consultas (find, findOne, findOneBy), pero aquí sí necesitamos el password para hacer la verificación del password. Con el "select" indicamos cuales son los campos que nos interesa que regrese la consulta y ahí especificamos el password.
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user) throw new UnauthorizedException('Credentials not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials not valid (password)');

    // todo: retornar JWT
    return user;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
