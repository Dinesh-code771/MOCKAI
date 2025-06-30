import { DBService } from '@db/db.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthDBService } from '@db/auth/auth-db.service';
import { AuthDBRepository } from '@db/auth/auth-db.repository';
import { StaticDataDBService } from '@db/static-data/static-data-db.service';
import { StaticDataDBRepository } from '@db/static-data/static-data-db.repository';
import { UsersDBService } from '@db/users/users-db.service';
import { UsersDBRepository } from '@db/users/users-db.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DBService,
    AuthDBService,
    AuthDBRepository,
    StaticDataDBService,
    StaticDataDBRepository,
    UsersDBService,
    UsersDBRepository,
  ],
  exports: [
    DBService,
    AuthDBService,
    StaticDataDBService,
    UsersDBService,
  ],
})
export class DBModule {}
