import { BoiteVitesse, City, Sellerie, TypeCarburant } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePubDto {

  @IsOptional()
  marque?: string;

  @IsOptional()
  model?: string;

  @IsOptional()
  anneeFabrication?: number;

  @IsOptional()
  nombrePlace?: number;

  @IsOptional()
  couleur?: string;

  @IsOptional()
  kilometrage?: number;

  @IsOptional()
  prix?: number;
  descrption?: string;

  @IsOptional()
  typeCarburant?: TypeCarburant;

  @IsOptional()
  city?: City;

  @IsOptional()
  boiteVitesse?: BoiteVitesse;

  @IsOptional()
  transmission?: string;

  @IsOptional()
  carrassorie?: string;

  @IsOptional()
  sellerie?: Sellerie;

  @IsOptional()
  equippements?: number[];
}
