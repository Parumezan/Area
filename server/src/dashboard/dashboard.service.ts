import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getDashboard(): string {
    return 'Dashboard !';
  }
}
