import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
//
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorators';
import { IncomingHttpHeaders } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Decoradores
  @Post('register')
  // Nombre de la función a continuación:
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Decoradores
  @Post('login')
  // Nombre de la función a continuación:
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Decoradores
  @Get('private')
  @UseGuards(AuthGuard())
  // Nombre de la función a continuación:
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Elis Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // Decoradores
  @Get('private2')
  @UseGuards(AuthGuard())
  // Nombre de la función a continuación:
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
