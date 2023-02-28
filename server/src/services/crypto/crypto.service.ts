import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Action, ActionType } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class CryptoService extends BaseService {
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.prisma.action
      .findMany({
        where: {
          service: {
            title: 'Crypto',
          },
        },
      })
      .then((actions: Action[]) => {
        actions.forEach((action: Action) => {
          if (action.isInput === true)
            switch (action.actionType) {
              case ActionType.CRYPTO_CHECK_PRICE:
                this.action_CRYPTO_CHECK_PRICE(action);
                break;
            }
        });
      });
  }

  async action_CRYPTO_CHECK_PRICE(action: Action) {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY,
        },
        params: {
          symbol: action.arguments[0],
        },
      },
    );
    if (response.status === 200) {
      const data = response.data.data.BTC;
      const price = data.quote.USD.price;
      console.log(`The current price of Bitcoin is ${price} USD`);
    } else {
      console.error(`Failed to retrieve data: ${response.statusText}`);
    }
  }
}
