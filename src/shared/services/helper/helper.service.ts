import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class HelperService {
    constructor(private readonly prisma: PrismaService) { }
    
    async getPaginatedData(key: Prisma.ModelName, currentPage: number, perPage: number, where?: any ){

        const totalRecords = await this.prisma[key].count({ where });
        const records = await this.prisma[key].findMany({
            where,
            skip: perPage * (currentPage - 1),
            take: perPage,
            orderBy: {
                created_at: "desc"
            }
        })

        const totalPages = Math.ceil(totalRecords / perPage);
        return {
            totalRecords,
            totalPages,
            data: records
        }

    }
}
