import { IsString, IsBoolean } from 'class-validator';

export class CreateBrickDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  published: boolean;
}
