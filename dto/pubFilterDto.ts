import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { TypeCarburant } from '@prisma/client';

export class PubFilterDto {
  @IsString()
  @IsOptional()
  marque: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsNumber()
  @IsOptional()
  anneeMin: number;@IsNumber()
  @IsOptional()
  anneeMax: number;

  @IsNumber()
  @IsOptional()
  nombrePlace: number;

  @IsNumber()
  @IsOptional()
  kilometrageMin: number;

  @IsNumber()
  @IsOptional()
  kilometrageMax: number;

  @IsNumber()
  @IsOptional()
  prixMin: number;

  @IsNumber()
  @IsOptional()
  prixMax: number;

  @IsEnum(TypeCarburant)
  @IsOptional()
  typeCarburant: TypeCarburant;
  @IsString()
  @IsOptional()
  couleur: string;
  orderByPrice: 'asc' | 'desc' | undefined;
  orderByKilometrage: 'asc' | 'desc' | undefined;
}