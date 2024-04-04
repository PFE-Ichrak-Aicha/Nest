import { IsNotEmpty, IsOctal, IsOptional, IsString } from "class-validator";


export class CreateSubscriptionDto {
    @IsNotEmpty()
    name : string
    @IsNotEmpty()
    duration : number
    @IsNotEmpty()
    price : number
    @IsOptional()
    description : string
}