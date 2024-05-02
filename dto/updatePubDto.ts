import { BoiteVitesse, City, Sellerie, TypeCarburant } from "@prisma/client"
import { IsNotEmpty , IsOptional} from "class-validator"

export class UpdatePubDto {
    @IsNotEmpty()
    @IsOptional()
    marque ?: string
    @IsOptional()
    @IsNotEmpty()
    model ?: string
    @IsNotEmpty()
    @IsOptional()
    anneeFabrication ?: number
    @IsNotEmpty()
    @IsOptional()
    nombrePlace ?: number
    @IsNotEmpty()
    @IsOptional()
    couleur ?: string
    @IsNotEmpty()
    @IsOptional()
    kilometrage ?: number
    @IsNotEmpty()
    @IsOptional()
    prix ?: number
    descrption ?: string
    @IsNotEmpty()
    @IsOptional()
    typeCarburant ?: TypeCarburant
    @IsNotEmpty()
  @IsOptional()
  city?: City;

  @IsNotEmpty()
  @IsOptional()
  boiteVitesse?: BoiteVitesse;

  @IsNotEmpty()
  @IsOptional()
  transmission?: string;

  @IsNotEmpty()
  @IsOptional()
  carrassorie?: string;

  @IsNotEmpty()
  @IsOptional()
  sellerie?: Sellerie;

  @IsOptional()
  equippements?: number[];

}