import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
//
import { SeedService } from './seed.service';
//
import { DOC_TAGS } from 'src/dictionary';
// import { Auth } from 'src/auth/decorators';
// import { ValidRoles } from 'src/auth/interfaces';

// .................................

@ApiTags(DOC_TAGS.seed)
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
