import { IsEmail, IsNotEmpty } from "class-validator";
export class ResetPasseConfirmationDto{
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    MotDePasseN: string
    @IsNotEmpty()
    code : string

}