import { Module } from '@nestjs/common';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';
import { UsersTransform } from '@users/users.transform';
import { DBModule } from '@db/db.module';

@Module({
  imports: [DBModule],
  controllers: [UsersController],
  providers: [UsersService, UsersTransform],
  exports: [UsersService],
})
export class UsersModule {}
