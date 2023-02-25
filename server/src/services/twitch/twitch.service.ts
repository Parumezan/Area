import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';
import axios, { AxiosRequestConfig } from 'axios';
import { Action, ActionType } from '@prisma/client';

@Injectable()
export class TwitchService extends BaseService {
  private twitchApiUrl = 'https://api.twitch.tv/helix';

  async getTwitterAccessToken(code: string) {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TWITCH_CALLBACK_URL,
    });
    const tokens = response.data;
    return tokens;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.prisma.action
      .findMany({
        where: {
          serviceId: 2,
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
    const username = action.arguments[0];
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    let data = {};
    try {
      data = {
        target_user_id: await this.getUserId(username, service.serviceToken),
      };
    } catch (error) {
      console.log('Error getting user ID:', error.response.data);
      throw new Error('Error getting user ID');
    }
    const options: AxiosRequestConfig = {
      method: 'PUT',
      url: `${this.twitchApiUrl}/users/blocks`,
      headers: headers,
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
      console.log('Error blocking user:', error.response.data);
      throw new Error('Error blocking user');
    }
  }

  async action_UNBLOCK_USER(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const username = action.arguments[0];
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${service.serviceToken}`,
    };
    let data = {};
    try {
      data = {
        target_user_id: await this.getUserId(username, service.serviceToken),
      };
    } catch (error) {
      console.log('Error getting user ID:', error.response.data);
      throw new Error('Error getting user ID');
    }
    const options: AxiosRequestConfig = {
      method: 'DELETE',
      url: `${this.twitchApiUrl}/users/blocks`,
      headers: headers,
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
      console.log('Error unblocking user:', error.response.data);
      throw new Error('Error unblocking user');
    }
  }

  async action_DETECT_STREAM(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const username = action.arguments[0];
    const game = action.arguments[1];
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
        game &&
        response.data.data[0].game_name === game
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

  async testMessage(token: string, username: string, message: string) {
    const headers = {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    };
    let data = {};
    try {
      data = {
        from_user_id: await this.getAuthenticatedUserId(token),
        to_user_id: await this.getUserId(username, token),
      };
    } catch (error) {
      console.log('Error getting authenticated user ID:', error.response.data);
      throw new Error('Error getting authenticated user ID');
    }
    console.log(data);
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
}
