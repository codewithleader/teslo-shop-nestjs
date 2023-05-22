import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity'; // Entity o Modelo del usuario de DB
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  // Si el token no ha expirado y es un JWT válido se ejecutará nuestro metodo personalizado "validate" para Validar si el usuario está activo o no en mi base de datos
  async validate(payload: IJwtPayload): Promise<User> {
    const { email } = payload;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new UnauthorizedException('Token not valid');

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    return user; // al retornar el user es añadido a la Request y puede ser usada en cualquier parte que se necesite (Request.user)
  }
}
