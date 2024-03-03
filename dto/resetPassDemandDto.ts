import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasseDemandDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
    //@IsNotEmpty()
   // verificationCode: string;

}