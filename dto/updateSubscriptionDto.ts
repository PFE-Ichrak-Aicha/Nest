import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateSubscriptionDto {
    @IsNotEmpty()
    @IsOptional()
    name ?: string
    @IsNotEmpty()
    @IsOptional()
    description ?: string;
    @IsNotEmpty()
    @IsOptional()
    price ?: number;
    @IsNotEmpty()
    @IsOptional()
    duration?: number; // in months

}