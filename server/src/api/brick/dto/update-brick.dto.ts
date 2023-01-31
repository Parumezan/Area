import { PartialType } from '@nestjs/mapped-types';
import { CreateBrickDto } from './create-brick.dto';

export class UpdateBrickDto extends PartialType(CreateBrickDto) {}
