import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateBrickDto {
  @IsString()
  title: string;

  @IsBoolean()
  published: boolean;

  @IsNumber()
  serviceId: number;
}
