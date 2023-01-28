import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { TwitterModule } from './services/twitter/twitter.module';
import { ClockModule } from './services/clock/clock.module';
import { BaseService } from './services/base/base.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BrickModule } from './api/brick/brick.module';

@Module({
  imports: [
    DashboardModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ClockModule,
    TwitterModule,
    BrickModule,
  ],
  controllers: [AppController],
  providers: [AppService, BaseService],
})
export class AppModule {}
