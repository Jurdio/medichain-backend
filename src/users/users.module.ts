import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DoctorsModule } from '../doctors/doctors.module';
import { PrivyService } from '../common/privy/privy.service';

@Module({
  imports: [DoctorsModule],
  controllers: [UsersController],
  providers: [PrivyService],
})
export class UsersModule {}




