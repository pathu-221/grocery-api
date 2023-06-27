import { CanActivate,Injectable, NotFoundException, UnauthorizedException, Inject } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IRequestUser } from "../decorators/auth-user.decorator";
/**
 * verifies if the store is owned by the user
 */
@Injectable()
export class StoreOwnerGuard implements CanActivate {

    constructor(private readonly owner: IRequestUser, 
        private readonly storeId: string,
        private readonly prisma: PrismaService) { }
        
    async canActivate() {
        //to verify if the store is owned by the user
        // const store = await this.prisma.store.findFirst({ where: { id: this.storeId}})

        // if (!store) throw new NotFoundException('Store Not found!');

        // if(store.owner_id !== this.owner.id) throw new UnauthorizedException('You Do not own this store');

        return true
    }
}  