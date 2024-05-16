import { IsString, IsOptional, IsNumber, IsEnum, IsInt } from 'class-validator';
import { BoiteVitesse, City, Sellerie, TypeCarburant } from '@prisma/client';
import { Transform } from 'class-transformer';

export class PubFilterDto {
  @IsString()
  @IsOptional()
  marque?: string;

  @IsString()
  @IsOptional()
  model?: string;


  @IsOptional()

  anneeMin?: number;


  @IsOptional()

  anneeMax?: number;

  //@IsNumber()
  @IsOptional()
  //@Transform(({ value }) => parseInt(value))
  nombrePlace?: number;




  @IsOptional()

  kilometrageMin?:number;


  @IsOptional()

  kilometrageMax?: number;


  @IsOptional()

  prixMin?: number;


  @IsOptional()
  
  prixMax?: number;

  @IsEnum(TypeCarburant)
  @IsOptional()
  typeCarburant?: TypeCarburant;

  @IsString()
  @IsOptional()
  couleur?: string;

  @IsEnum(City) // Ajout du filtre pour la ville
  @IsOptional()
  city?: City;

  @IsEnum(BoiteVitesse) // Ajout du filtre pour la boîte de vitesse
  @IsOptional()
  boiteVitesse?: BoiteVitesse;

  @IsString() // Ajout du filtre pour la transmission
  @IsOptional()
  transmission?: string;

  @IsEnum(Sellerie) // Ajout du filtre pour la sellerie
  @IsOptional()
  sellerie?: Sellerie;

  //@IsString({ each: true }) // Ajout du filtre pour les équipements
  //@IsOptional()
  //equippements: string[];
  @IsString({ each: true })
  @IsOptional()
  equippements?: string[];
  orderByPrice: 'asc' | 'desc' | undefined;
  orderByKilometrage: 'asc' | 'desc' | undefined;
}