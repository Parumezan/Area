import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';
import axios, { AxiosRequestConfig } from 'axios';
import { Action, ActionType } from '@prisma/client';

@Injectable()
export class TwitchService extends BaseService {
  private twitchApiUrl = 'https://api.twitch.tv/helix';

  async getTwitchAccessToken(code: string) {
    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TWITCH_CALLBACK_URL,
      });
      const tokens = response.data;
      return tokens;
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
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
        actions.forEach((action: Action) => {
          if (action.isInput === true)
            switch (action.actionType) {
              case ActionType.SEND_WHISPERS_TWITCH:
                this.action_SEND_MESSAGE(action);
                break;
              case ActionType.BLOCK_USER_TWITCH:
                this.action_BLOCK_USER(action);
                break;
              case ActionType.UNBLOCK_USER_TWITCH:
                this.action_UNBLOCK_USER(action);
                break;
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

  async getAuthenticatedUserId(authToken: string) {
    const apiUrl = `${this.twitchApiUrl}/users`;
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
      console.log('Error getting authenticated user ID:', error.response.data);
      throw new Error('Error getting authenticated user ID');
    }
  }

  async getUserId(username: string, authToken: string) {
    const apiUrl = `${this.twitchApiUrl}/users`;
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
      console.log('Error getting user ID:', error.response.data);
      throw new Error('Error getting user ID');
    }
  }

  async getIdByNameGame(gameName: string, authToken: string) {
    const apiUrl = `${this.twitchApiUrl}/games`;
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
      console.log('Error getting game ID:', error.response.data);
      return -1;
    }
  }

  async action_SEND_MESSAGE(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const username = action.arguments[0];
    const message = action.arguments[1];
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    let data = {};
    try {
      data = {
        from_user_id: await this.getAuthenticatedUserId(service.serviceToken),
        to_user_id: await this.getUserId(username, service.serviceToken),
      };
    } catch (error) {
      console.log('Error getting authenticated user ID:', error.response.data);
      throw new Error('Error getting authenticated user ID');
    }
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
      throw new Error('Error whisper user');
    }
  }

  async action_BLOCK_USER(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    for (let i = 0; i < action.arguments.length; i++) {
      const options: AxiosRequestConfig = {
        method: 'PUT',
        url: `${this.twitchApiUrl}/users/blocks`,
        headers: headers,
        data: { target_user_id: action.arguments[i] },
      };
      try {
        const response = await axios(options);
        if (response.status === 204) {
          console.log('Request was successful!');
        } else {
          console.log(`Request failed with status code: ${response.status}`);
        }
      } catch (error) {
        console.log('Error unblocking user:', error.response.data);
      }
    }
  }

  async action_UNBLOCK_USER(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    for (let i = 0; i < action.arguments.length; i++) {
      const options: AxiosRequestConfig = {
        method: 'DELETE',
        url: `${this.twitchApiUrl}/users/blocks`,
        headers: headers,
        data: { target_user_id: action.arguments[i] },
      };
      try {
        const response = await axios(options);
        if (response.status === 204) {
          console.log('Request was successful!');
        } else {
          console.log(`Request failed with status code: ${response.status}`);
        }
      } catch (error) {
        console.log('Error unblocking user:', error.response.data);
      }
    }
  }

  async action_DETECT_USER_STREAM_GAMES(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const username = action.arguments[0];
    const game = await this.getIdByNameGame(
      action.arguments[1],
      service.serviceToken,
    );
    if (game == -1) return false;
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    const params = {
      user_login: username,
    };
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${this.twitchApiUrl}/streams`,
      headers: headers,
      params: params,
    };
    try {
      const response = await axios(options);
      if (response.status === 200) {
        console.log('Request was successful!');
      } else {
        console.log(`Request failed with status code: ${response.status}`);
      }
      if (
        response.data.data.length > 0 &&
        response.data.data[0].game_id === game
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error detecting stream:', error.response.data);
      throw new Error('Error detecting stream');
    }
  }

  async action_DETECT_STREAMERS_PLAY_GAMES(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const game = await this.getIdByNameGame(
      action.arguments[0],
      service.serviceToken,
    );
    if (game === -1) throw new Error('Game not found');
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    const params = {
      game_id: game,
    };
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${this.twitchApiUrl}/streams`,
      headers: headers,
      params: params,
    };
    try {
      const response = await axios(options);
      if (response.status === 200) {
        console.log('Request was successful!');
        return response.data.data.map((stream) => stream.user_name);
      } else {
        console.log(`Request failed with status code: ${response.status}`);
      }
    } catch (error) {
      console.log('Error detecting stream:', error.response.data);
      throw new Error('Error detecting stream');
    }
  }
}
