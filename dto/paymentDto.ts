// Importez les annotations nécessaires et la classe Type de class-transformer
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, IsNumber, IsOptional, IsBoolean, ValidateNested } from 'class-validator';

// Définissez d'abord la classe ExpertDto
export class ExpertDto {

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  cout: number;
}

// Ensuite, définissez la classe PaymentDto
export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  marque: string;

  @IsNotEmpty()
  @IsString()
  model: string;


  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  successUrl: string;

  @IsNotEmpty()
  @IsUrl()
  urlCancel: string;

  @IsBoolean()
  @IsNotEmpty()
  paye : boolean ;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExpertDto)
  expert: ExpertDto;
}