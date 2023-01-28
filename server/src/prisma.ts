import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PrismaProvider = {
  provide: 'Prisma',
  useValue: prisma,
};
