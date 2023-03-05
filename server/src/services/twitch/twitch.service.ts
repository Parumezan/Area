import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';
import axios, { AxiosRequestConfig } from 'axios';
import { Action, ActionType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { LinkerService } from '../../linker/linker.service';

@Injectable()
export class TwitchService extends BaseService {
  constructor(@Inject('Prisma') protected readonly prisma: PrismaClient) {
    super(prisma);
  }
  private readonly linkerService: LinkerService = new LinkerService();
  private twitchApiUrl = 'https://api.twitch.tv/helix';

  async getTwitchAccessToken(code: string) {
    try {
      console.log(process.env.TWITCH_CALLBACK_URL + '_twitter');
      const response = await axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.OAUTH2_REDIRECT_URI + '_twitch',
      });
      console.log(response.data);
      const tokens = response.data;
      return tokens;
    } catch (error) {
      console.log("Can't get access token");
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.prisma.action
      .findMany({
        where: {
          service: {
            title: 'Twitch',
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
              case ActionType.DETECT_STREAMERS_PLAY_GAMES_TWITCH:
                this.action_DETECT_STREAMERS_PLAY_GAMES(action);
                break;
              case ActionType.DETECT_USER_STREAM_GAMES_TWITCH:
                this.action_DETECT_USER_STREAM_GAMES(action);
                break;
            }
        });
      });
  }

  async addTokenToDatabase(token: any, userId: number) {
    const service = await this.prisma.service.findMany({
      where: {
        accountId: userId,
        title: 'Twitch',
      },
    });
    if (service.length == 0) {
      console.log('Error getting authenticated user ID:', token);
      await this.prisma.service.create({
        data: {
          title: 'Twitch',
          accountId: userId,
          serviceToken: token.access_token,
          serviceTokenSecret: token.refresh_token,
        },
      });
    } else {
      await this.prisma.service.update({
        where: {
          id: service[0].id,
        },
        data: {
          serviceToken: token.access_token,
          serviceTokenSecret: token.refresh_token,
        },
      });
    }
  }

  async refreshToken(authToken: string) {
    const apiUrl = 'https://id.twitch.tv/oauth2/token';
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: authToken,
    };
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: apiUrl,
      headers: headers,
      params: params,
    };
    try {
      const response = await axios(options);
      const tokens = response.data;
      await this.prisma.service.updateMany({
        where: {
          title: 'Twitch',
          serviceTokenSecret: tokens.refresh_token,
        },
        data: {
          serviceToken: tokens.access_token,
        },
      });
      return tokens;
    } catch (error) {
      console.log("Can't get access token");
    }
  }

  async getAuthenticatedUserId(authToken: string) {
    const apiUrl = `https://api.twitch.tv/helix/users`;
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${authToken}`,
    };
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: apiUrl,
      headers: headers,
    };
    try {
      const response = await axios(options);
      const authenticatedUser = response.data.data[0];
      return authenticatedUser.id;
    } catch (error) {
      if (error.response.status == 401) {
        let serv = await this.prisma.service.findFirst({
          where: {
            title: 'Twitch',
            serviceToken: authToken,
          },
        });
        const tokens = await this.refreshToken(serv.serviceTokenSecret);
        return await this.getAuthenticatedUserId(tokens.access_token);
      }
      console.log('Error getting authenticated user ID:', error.response.data);
    }
  }

  async getUserId(username: string, authToken: string) {
    const apiUrl = `https://api.twitch.tv/helix/users`;
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${authToken}`,
    };
    const params = {
      login: username,
    };
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: apiUrl,
      headers: headers,
      params: params,
    };
    try {
      const response = await axios(options);
      const user = response.data.data[0];
      const userId = user.id;
      return userId;
    } catch (error) {
      if (error.response.status == 401) {
        let serv = await this.prisma.service.findFirst({
          where: {
            title: 'Twitch',
            serviceToken: authToken,
          },
        });
        const tokens = await this.refreshToken(serv.serviceTokenSecret);
        return await this.getUserId(username, tokens.access_token);
      }
      console.log('Error getting user ID:', error.response.data);
    }
  }

  async getIdByNameGame(gameName: string, authToken: string) {
    const apiUrl = `https://api.twitch.tv/helix/games`;
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${authToken}`,
    };
    const params = {
      name: gameName,
    };
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: apiUrl,
      headers: headers,
      params: params,
    };
    try {
      const response = await axios(options);
      if (response.data.data.length == 0) return -1;
      const game = response.data.data[0];
      const gameId = game.id;
      return gameId;
    } catch (error) {
      if (error.response.status == 401) {
        console.log('Error getting game ID:', error.response.data);
        let serv = await this.prisma.service.findFirst({
          where: {
            title: 'Twitch',
            serviceToken: authToken,
          },
        });
        const tokens = await this.refreshToken(serv.serviceTokenSecret);
        return await this.getIdByNameGame(gameName, tokens.access_token);
      }
      console.log('Error getting game ID:', error.response.data);
      return -1;
    }
  }

  async action_SEND_MESSAGE(action: Action, prisma: PrismaClient) {
    let service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const username = action.arguments[0];
    const message = action.arguments[1];
    let data = {};
    try {
      const toUser = await this.getUserId(username, service.serviceToken);
      service = await prisma.service.findFirst({
        where: {
          id: action.serviceId,
        },
      });
      const fromUser = await this.getAuthenticatedUserId(service.serviceToken);
      data = {
        to_user_id: toUser,
        from_user_id: fromUser,
      };
    } catch (error) {
      console.log('Error getting authenticated user ID:', error.response.data);
    }
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `${this.twitchApiUrl}/whispers`,
      headers: headers,
      params: {
        message: message,
      },
      data: data,
    };
    try {
      const response = await axios(options);
      if (response.status === 204) {
        console.log('Request was successful!');
      } else {
        console.log(`Request failed with status code: ${response.status}`);
      }
      return response.status;
    } catch (error) {
      console.log('Error whisper user:', error.response.data);
    }
  }

  async action_BLOCK_USER(action: Action, prisma: PrismaClient) {
    let service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const userId = await this.getAuthenticatedUserId(service.serviceToken);
    service = await prisma.service.findFirst({
      where: { id: action.serviceId },
    });
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    const twitchApiUrl = 'https://api.twitch.tv/helix';
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${twitchApiUrl}/users/blocks`,
      headers: headers,
      params: {
        broadcaster_id: userId,
      },
    };
    let blockList = [];
    try {
      const response = await axios(options);
      if (response.status === 200) console.log('Request was successful!');
      else console.log(`Request failed with status code: ${response.status}`);
      const tempList = response.data.data;
      tempList.forEach((element) => {
        blockList.push(element.user_id);
      });
    } catch (error) {
      console.log('Error getting user block list:', error.response.data);
    }
    for (let i = 0; i < action.arguments.length; i++) {
      if (/^\d+$/.test(action.arguments[i]) == false) {
        action.arguments[i] = await this.getUserId(
          action.arguments[i],
          service.serviceToken,
        );
      }
      if (blockList.includes(action.arguments[i])) continue;
      const options: AxiosRequestConfig = {
        method: 'PUT',
        url: `${twitchApiUrl}/users/blocks`,
        headers: headers,
        data: { target_user_id: action.arguments[i] },
      };
      try {
        const response = await axios(options);
        if (response.status === 204) {
          console.log(
            'Request was successful!, user ' + action.arguments[i] + ' blocked',
          );
        } else {
          console.log(`Request failed with status code: ${response.status}`);
        }
      } catch (error) {
        console.log('Error unblocking user:', error);
      }
    }
  }

  async action_UNBLOCK_USER(action: Action, prisma: PrismaClient) {
    let service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const userId = await this.getAuthenticatedUserId(service.serviceToken);
    service = await prisma.service.findFirst({
      where: { id: action.serviceId },
    });
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    const twitchApiUrl = 'https://api.twitch.tv/helix';
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${twitchApiUrl}/users/blocks`,
      headers: headers,
      params: {
        broadcaster_id: userId,
      },
    };
    let blockList = [];
    try {
      const response = await axios(options);
      if (response.status === 200) console.log('Request was successful!');
      else console.log(`Request failed with status code: ${response.status}`);
      const tempList = response.data.data;
      tempList.forEach((element) => {
        blockList.push(element.user_id);
      });
    } catch (error) {
      console.log('Error getting user block list:', error.response.data);
    }
    for (let i = 0; i < action.arguments.length; i++) {
      if (/^\d+$/.test(action.arguments[i]) == false) {
        action.arguments[i] = await this.getUserId(
          action.arguments[i],
          service.serviceToken,
        );
      }
      if (!blockList.includes(action.arguments[i])) continue;
      const options: AxiosRequestConfig = {
        method: 'DELETE',
        url: `${twitchApiUrl}/users/blocks`,
        headers: headers,
        data: { target_user_id: action.arguments[i] },
      };
      try {
        const response = await axios(options);
        if (response.status === 204) {
          console.log(
            'Request was successful, unblock user ',
            action.arguments[i],
          );
        } else {
          console.log(`Request failed with status code: ${response.status}`);
        }
      } catch (error) {
        console.log('Error unblocking user:', error);
      }
    }
  }

  async action_DETECT_USER_STREAM_GAMES(action: Action) {
    let service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const username = action.arguments[0];
    const game = await this.getIdByNameGame(
      action.arguments[1],
      service.serviceToken,
    );
    if (game == -1) return;
    service = await this.prisma.service.findFirst({
      where: { id: action.serviceId },
    });
    const twitchApiUrl = 'https://api.twitch.tv/helix';
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    const params = {
      user_login: username,
    };
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${twitchApiUrl}/streams`,
      headers: headers,
      params: params,
    };
    try {
      const response = await axios(options);
      if (response.status !== 200) return;
      if (response.data.data.length == 0) {
        await this.prisma.action.update({
          where: { id: action.id },
          data: { arguments: [username, game, 'false'] },
        });
        return;
      }
      if (
        response.data.data[0].game_id === game &&
        (action.arguments.length < 3 || action.arguments[2] === 'false')
      ) {
        await this.prisma.action.update({
          where: { id: action.id },
          data: { arguments: [username, game, 'true'] },
        });
        this.linkerService.execAllFromAction(
          action,
          [username, game],
          this.prisma,
        );
      } else if (
        action.arguments.length < 3 ||
        action.arguments[2] === 'true'
      ) {
        await this.prisma.action.update({
          where: { id: action.id },
          data: { arguments: [username, game, 'false'] },
        });
      }
    } catch (error) {
      console.log('Error detecting stream:', error.response.data);
    }
  }

  async action_DETECT_STREAMERS_PLAY_GAMES(action: Action) {
    let service = await this.prisma.service.findFirst({
      where: { id: action.serviceId },
    });
    const game = await this.getIdByNameGame(
      action.arguments[0],
      service.serviceToken,
    );
    service = await this.prisma.service.findFirst({
      where: { id: action.serviceId },
    });
    if (game === -1) {
      console.log('Game not found');
      return;
    }
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    let listUsers: string[] = [];
    const twitchApiUrl = 'https://api.twitch.tv/helix';
    const params = {
      game_id: game,
    };
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${twitchApiUrl}/streams`,
      headers: headers,
      params: params,
    };
    try {
      const response = await axios(options);
      if (response.status !== 200) return;
      if (response.data.data.length > 0) {
        for (let i = 0; i < response.data.data.length; i++)
          listUsers.push(response.data.data[i].user_id);
      }
    } catch (error) {
      console.log('Error detecting stream:');
    }
    this.linkerService.execAllFromAction(action, listUsers, this.prisma);
  }
}
