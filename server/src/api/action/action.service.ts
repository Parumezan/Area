import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Action, PrismaClient } from '@prisma/client';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionService {
  constructor(@Inject('Prisma') private readonly prisma: PrismaClient) {}

  async readAllActions(accountId: number): Promise<Action[]> {
    const brick = await this.prisma.brick.findMany({
      where: { accountId: accountId },
    });
    if (!brick) throw new HttpException('Forbidden', 403);
    return this.prisma.action.findMany({
      where: {
        brickId: {
          in: brick.map((b) => b.id),
        },
      },
    });
  }

  async readActionsFromBrick(
    accountId: number,
    brickId: number,
  ): Promise<Action[]> {
    const brick = await this.prisma.brick.findUnique({
      where: { id: brickId },
    });
    if (!brick) throw new HttpException('Forbidden', 403);
    if (brick.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    return this.prisma.action.findMany({
      where: {
        brickId: brickId,
      },
    });
  }

  async createAction(
    accountId: number,
    action: CreateActionDto,
  ): Promise<Action> {
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    let service = await this.prisma.service.findFirst({
      where: { accountId: accountId, title: action.serviceName },
    });

    if (service === null)
      service = await this.prisma.service.findFirst({
        where: { accountId: -1, title: action.serviceName },
      });
    if (!brick) throw new HttpException('Forbidden', 403);
    if (brick.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    return this.prisma.action.create({
      data: {
        description: action.description,
        brickId: action.brickId,
        serviceId: service.id,
        arguments: action.arguments,
        isInput: action.isInput,
        actionType: action.actionType,
      },
    });
  }

  async readAction(accountId: number, id: number): Promise<Action> {
    const action = await this.prisma.action.findUnique({
      where: { id: id },
    });
    if (!action) throw new HttpException('Forbidden', 403);
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    if (!brick) throw new HttpException('Forbidden', 403);
    if (brick.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    return action;
  }

  async updateAction(
    accountId: number,
    id: number,
    data: UpdateActionDto,
  ): Promise<Action> {
    const action = await this.prisma.action.findUnique({
      where: { id: id },
    });
    if (!action) throw new HttpException('Forbidden', 403);
    let service = await this.prisma.service.findFirst({
      where: { accountId: accountId, title: data.serviceName },
    });

    if (service === null)
      service = await this.prisma.service.findFirst({
        where: { accountId: -1, title: data.serviceName },
      });
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    if (!brick) throw new HttpException('Forbidden', 403);
    if (brick.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    delete data.serviceName;
    return this.prisma.action.update({
      where: { id: id },
      data: { ...data, serviceId: service.id },
    });
  }

  async deleteAction(accountId: number, id: number): Promise<Action> {
    const action = await this.prisma.action.findUnique({
      where: { id: id },
    });
    if (!action) throw new HttpException('Forbidden', 403);
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    if (!brick) throw new HttpException('Forbidden', 403);
    if (brick.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    return this.prisma.action.delete({ where: { id: id } });
  }
}
