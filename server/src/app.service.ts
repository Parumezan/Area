import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  redirect(req: any, res: any) {
    if (req.headers.authorization) {
      return res.redirect('/dashboard');
    }
    return res.redirect('/auth/login');
  }
}
