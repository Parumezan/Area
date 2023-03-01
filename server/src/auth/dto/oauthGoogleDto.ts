import { IsString } from 'class-validator';

export class OauthGoogleDto {
  @IsString()
  oauthToken: string;
}
