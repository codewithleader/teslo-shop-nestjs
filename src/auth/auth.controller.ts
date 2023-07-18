import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  // SetMetadata, // Se reemplazó por customDecorator RoleProtected
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
//
import { IncomingHttpHeaders } from 'http';
//
import { User } from './entities/user.entity';
//
import { CreateUserDto, LoginUserDto } from './dto';
//
import { Auth, GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
//
import { UserRoleGuard } from './guards/user-role/user-role.guard';
//
import { AuthService } from './auth.service';
//
import { ValidRoles } from './interfaces';
import { DOC_TAGS } from 'src/dictionary';

// ...............................

@ApiTags(DOC_TAGS.auth)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ruta
  @Post('register')
  // Otros Decoradores
  // Nombre del metodo:
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Ruta
  @Post('login')
  // Otros Decoradores
  // Nombre del metodo:
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Ruta
  @Get('check-status')
  // Otros Decoradores
  @Auth()
  checkAuthStatus(
    //
    @GetUser() user: User,
  ) {
    // todo:

    return this.authService.checkAuthStatus(user);
  }

  // Ruta
  @Get('private')
  // Otros Decoradores
  @UseGuards(AuthGuard())
  // Nombre del metodo:
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

  // Ruta
  @Get('private2')
  // Otros Decoradores
  // @SetMetadata('roles', ['admin', 'super-user']) // Se reemplazó por customDecorator RoleProtected
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  // Nombre del metodo:
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  // Ruta
  @Get('private3')
  // Otros Decoradores
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  // Nombre del metodo:
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
