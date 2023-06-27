import { Prisma } from "@prisma/client";

export interface IRequestOptions {
    transaction?: Prisma.TransactionClient;
  }