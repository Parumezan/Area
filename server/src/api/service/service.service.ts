import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Service, PrismaClient } from '@prisma/client';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(@Inject('Prisma') private readonly prisma: PrismaClient) {}

  async readAllServices(accountId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: {
        accountId: accountId,
      },
    });

    const baseServices = await this.prisma.service.findMany({
      where: {
        accountId: -1,
      },
    });
    return services.concat(baseServices);
  }

  async createService(
    accountId: number,
    service: CreateServiceDto,
  ): Promise<Service> {
    return this.prisma.service.create({
      data: {
        title: service.title,
        serviceToken: service.serviceToken,
        serviceTokenSecret: service.serviceTokenSecret,
        accountId: accountId,
      },
    });
  }

  async readService(accountId: number, id: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    if (!service) throw new HttpException('Forbidden', 403);
    if (service.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    return service;
  }

  async updateService(
    accountId: number,
    id: number,
    data: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    if (!service) throw new HttpException('Forbidden', 403);
    if (service.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    return this.prisma.service.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteService(accountId: number, id: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    if (!service) throw new HttpException('Forbidden', 403);
    if (service.accountId !== accountId)
      throw new HttpException('Forbidden', 403);
    return this.prisma.service.delete({ where: { id: id } });
  }
}
