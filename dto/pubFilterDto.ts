import { IsString, IsOptional, IsNumber, IsEnum, IsInt } from 'class-validator';
import { TypeCarburant } from '@prisma/client';
import { Transform } from 'class-transformer';

export class PubFilterDto {
  @IsString()
  @IsOptional()
  marque: string;

  @IsString()
  @IsOptional()
  model: string;


  @IsOptional()

  anneeMin: string;

  @IsOptional()
  anneeMax: string;


  @IsOptional()
 
  nombrePlace: string;

 
  @IsOptional()
  kilometrageMin: string;


  @IsOptional()
  kilometrageMax: string;


  @IsOptional()
  prixMin: string;


  @IsOptional()
  prixMax: string;

  @IsEnum(TypeCarburant)
  @IsOptional()
  typeCarburant: TypeCarburant;
  @IsString()
  @IsOptional()
  couleur: string;
  orderByPrice: 'asc' | 'desc' | undefined;
  orderByKilometrage: 'asc' | 'desc' | undefined;
}