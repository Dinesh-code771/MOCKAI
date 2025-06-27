import { DBService } from '@db/db.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthDBService } from './auth/auth-db.service';
import { AuthDBRepository } from './auth/auth-db.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DBService,
    AuthDBService,
    AuthDBRepository,
  ],
  exports: [
    DBService,
    AuthDBService,
  ],
})
export class DBModule {}
