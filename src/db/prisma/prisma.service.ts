import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  //이제 Prisma서비스는 클라이언트다.
  async onModuleInit() {
    await this.$connect();
  }
}
