import { Module } from '@nestjs/common';
import { StaticDataController } from '@static-data/static-data.controller';
import { StaticDataService } from '@static-data/static-data.service';
import { StaticDataTransform } from '@static-data/static-data.transform';
import { DBModule } from '@db/db.module';

@Module({
  imports: [DBModule],
  controllers: [StaticDataController],
  providers: [StaticDataService, StaticDataTransform],
})
export class StaticDataModule {}
