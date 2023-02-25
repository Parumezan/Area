import { IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  title: string;

  @IsString()
  serviceToken: string;

  @IsString()
  serviceTokenSecret: string;
}
