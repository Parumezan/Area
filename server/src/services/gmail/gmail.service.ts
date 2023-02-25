import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';
import { Action } from '@prisma/client';
// import { Action, ActionType } from '@prisma/client';
// import { google } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GmailService extends BaseService {
  getGmail(): string {
    return 'gmail';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.prisma.action
      .findMany({
        where: {
          serviceId: 3,
        },
      })
      .then((actions: Action[]) => {
        actions.forEach((action: Action) => {
          if (action.isInput === true)
            switch (
              action.actionType
              // case ActionType.GET_EMAIL_FROM_USER:
              // this.action_GET_EMAIL_FROM_USER(action);
              // break;
            ) {
            }
        });
      });
  }
  // NEXT_PUBLIC_GOOGLE_CLIENT_ID=614953799928-lp9gcgr13vmlmrr3gch9ip7b37fl6bgb.apps.googleusercontent.com
  // NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=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
  //
  // NEXT_PUBLIC_OAUTH2_REDIRECT_URI=http://localhost:8081/callback

  async action_GET_EMAIL_FROM_USER(action: Action) {
    if (action.arguments.length === 0) return;
    // const user = action.arguments[0];

    const accessToken = await this.prisma.service
      .findUnique({
        where: {
          id: action.serviceId,
        },
      })
      .then((service) => service.serviceToken);

    // fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    // method: 'GET',
    // headers: {
    // Authorization: `Bearer ${accessToken}`,
    // },
    // })
    // .then((response) => response.json())
    // .then((data) => {
    // console.log(data);
    // });

    fetch(`https://www.googleapis.com/gmail/v1/users/me/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/http',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
}
