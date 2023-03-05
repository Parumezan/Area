import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Action, ActionType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { LinkerService } from 'src/linker/linker.service';
import axios from 'axios';

@Injectable()
export class CryptoService extends BaseService {
  constructor(
    @Inject('Prisma') protected readonly prisma: PrismaClient,
    private readonly linkerService: LinkerService,
  ) {
    super(prisma);
  }
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
        actions.forEach(async (action: Action) => {
          if (
            (await this.prisma.brick.findFirst({
              where: { id: action.brickId, active: true },
            })) === null
          ) {
            console.log('brick not active');
          } else if (action.isInput === true)
            switch (action.actionType) {
              case ActionType.CRYPTO_CHECK_PRICE_UP:
                this.action_CRYPTO_CHECK_PRICE_UP(action);
                break;
              case ActionType.CRYPTO_CHECK_PRICE_DOWN:
                this.action_CRYPTO_CHECK_PRICE_DOWN(action);
                break;
            }
        });
      });
  }

  async action_CRYPTO_CHECK_PRICE_UP(action: Action) {
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
    if (response.status !== 200)
      console.error(`Failed to retrieve data: ${response.statusText}`);
    const data = response.data.data.BTC;
    const price = data.quote.USD.price;
    if (action.arguments[1] <= price.toString()) return;
    await this.prisma.action.update({
      where: { id: action.id },
      data: { arguments: [action.arguments[0], price.toString()] },
    });
    this.linkerService.execAllFromAction(
      action,
      [`The current price of Bitcoin is now ${price} USD`],
      this.prisma,
    );
  }

  async action_CRYPTO_CHECK_PRICE_DOWN(action: Action) {
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
    if (response.status !== 200)
      console.error(`Failed to retrieve data: ${response.statusText}`);
    const data = response.data.data.BTC;
    const price = data.quote.USD.price;
    if (action.arguments[1] >= price.toString()) return;
    await this.prisma.action.update({
      where: { id: action.id },
      data: { arguments: [action.arguments[0], price.toString()] },
    });
    this.linkerService.execAllFromAction(
      action,
      [`The current price of Bitcoin is now ${price} USD`],
      this.prisma,
    );
  }
}
