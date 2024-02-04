import { TypeCarburant } from "@prisma/client"
import { IsNotEmpty } from "class-validator"

export class CreatePubDto {
    @IsNotEmpty()
    marque: string
    @IsNotEmpty()
    model: string
    @IsNotEmpty()
    anneeFabrication: number
    @IsNotEmpty()
    nombrePlace: number
    @IsNotEmpty()
    couleur: string
    @IsNotEmpty()
    kilometrage: number
    @IsNotEmpty()
    prix: number
    descrption: string
    @IsNotEmpty()
    typeCarburant: TypeCarburant
}