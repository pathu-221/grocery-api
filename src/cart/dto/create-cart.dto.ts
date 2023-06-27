import { IsNumber, IsString } from "class-validator";

export class CreateCartDto {

    @IsString()
    product_id: string
    
    @IsNumber()
    quantity: number
}
