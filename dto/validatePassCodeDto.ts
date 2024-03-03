import { IsEmail, IsNotEmpty } from "class-validator";
export class ValidatePassCodeDto{
    //@IsEmail()
    //@IsNotEmpty()
    //email: string
    //@IsNotEmpty()
    //MotDePasseN: string
    @IsNotEmpty()
    code : string

}