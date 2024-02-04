import { IsNotEmpty } from "class-validator";

export class DeleteAccountDto{
@IsNotEmpty()
MotDePasse : string
}