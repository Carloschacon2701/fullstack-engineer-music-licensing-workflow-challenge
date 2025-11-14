import { Module } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { LicensesController } from './licenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './entities/license.entity';
import { Status } from './entities/status.entity';
import { Track } from '../tracks/entities/track.entity';
import { LicenseStatusHistory } from './entities/license-status-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([License, Status, Track, LicenseStatusHistory]),
  ],
  controllers: [LicensesController],
  providers: [LicensesService],
  exports: [LicensesService],
})
export class LicensesModule {}
