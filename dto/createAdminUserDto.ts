import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAdminUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    MotDePasse: string
    PhotoProfil: string


}