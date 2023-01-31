import { ActionType } from '@prisma/client';
import { IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class CreateActionDto {
  @IsString()
  description: string;

  @IsNumber()
  brickId: number;

  @IsNumber()
  serviceId: number;

  @IsString({ each: true })
  arguments: string[];

  @IsBoolean()
  isInput: boolean;

  @IsEnum(ActionType)
  actionType: ActionType;
}
