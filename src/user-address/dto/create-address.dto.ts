import { IsNumber, IsOptional, IsString } from "class-validator";


export class CreateAddressDto {

    @IsString()
    address_1: string
    
    @IsString()
    @IsOptional()
    address_2?: string

    @IsString()
    city: string

    @IsString()
    state: string

    @IsNumber()
    zip: number
    
    @IsString()
    name: string
}
