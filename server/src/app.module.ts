import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { TwitterModule } from './services/twitter/twitter.module';
import { ClockModule } from './services/clock/clock.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BrickModule } from './api/brick/brick.module';
import { ActionModule } from './api/action/action.module';
import { BaseModule } from './services/base/base.module';
import { PrismaProvider } from './prisma';

@Module({
  imports: [
    DashboardModule,
    AuthModule,
    ScheduleModule.forRoot(),
    BaseModule,
    ClockModule,
    TwitterModule,
    BrickModule,
    ActionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaProvider],
})
export class AppModule {}
