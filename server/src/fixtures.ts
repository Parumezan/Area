/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userExists = await prisma.account.findUnique({
    where: {
      id: -1,
    },
  });

  if (!userExists) {
    await prisma.account.create({
      data: {
        id: -1,
        email: 'admin@admin.com',
        password: 'admin',
      },
    });
  }

  const servicesExist = await prisma.service.findMany({
    where: {
      accountId: -1,
    },
  });

  if (servicesExist.length == 0) {
    await prisma.service.createMany({
      data: [
        {
          id: -1,
          title: 'Time',
          accountId: -1,
          serviceToken: '',
          serviceTokenSecret: '',
        },
        {
          id: -2,
          title: 'Crypto',
          accountId: -1,
          serviceToken: '',
          serviceTokenSecret: '',
        },
        {
          id: -3,
          title: 'Weather',
          accountId: -1,
          serviceToken: '',
          serviceTokenSecret: '',
        },
        {
          id: -4,
          title: 'OnePiece',
          accountId: -1,
          serviceToken: '',
          serviceTokenSecret: '',
        },
      ],
    });
  }
}

main();
