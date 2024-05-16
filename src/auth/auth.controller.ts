import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { InscriptionDto } from 'dto/inscriptionDto';
import { AuthService } from './auth.service';
import { connexionDto } from 'dto/connexionDto';
import { ResetPasseDemandDto } from 'dto/resetPassDemandDto';
import { ResetPasseConfirmationDto } from 'dto/resetPasseConfirmationDto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { request } from 'http';
//import { Response } from '@nestjs/common'
import { Response , Request } from 'express';

import { ValidatePassCodeDto } from 'dto/validatePassCodeDto';

//import { Request } from "express"
//import { DeleteAccountDto } from 'dto/deleteAccountDto';
//import { UpdateAccountDto } from 'dto/updateAccountDto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post("inscription")
  inscription(@Body() inscriptionDto: InscriptionDto) {
    return this.authService.inscription(inscriptionDto)
  }
  
  @Post("connexion")
  connexion(@Body() connexionDto: connexionDto) {
    return this.authService.connexion(connexionDto)
  }

  @Post("connexionAdmin")
  connexionAdmin(@Body() connexionDto: connexionDto) {
    return this.authService.connexionAdmin(connexionDto)
  }

  
  @Post("connexionExpert")
  connexionExpert(@Body() connexionDto: connexionDto) {
    return this.authService.connexionExpert(connexionDto)
  }

  @Post('reset-pass-demand')
  async resetPassDemand(@Body() resetPassDemandDto: ResetPasseDemandDto, @Res() res: Response) {
    try {
      await this.authService.resetPassDemand(resetPassDemandDto.email);
      return res.status(200).json({ message: 'Reset password email has been sent' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  

@Post('reset-pass-verification')
async validateResetCode(@Body() validatePassCodeDto: ValidatePassCodeDto, @Res() res: Response, @Req() req:Request) {
  try {
    const result = await this.authService.validatePasswordResetCode(validatePassCodeDto.code ,req );
    if ('error' in result) {
        return res.status(401).json({ message: result.error });
    } else {
       // const email = this.authService.getEmailFromResetUrl(req);
        // Continuer avec le reste du code en utilisant l'email récupéré et le code validé
        return res.status(200).json({ message: 'Reset code validated successfully' });
    }
} catch (error) {
    return res.status(401).json({ message: error.message });
}
}

@Post('reset-pass-confirmation')
async resetPassConfirmation(@Body() resetPassConfirmationDto: ResetPasseConfirmationDto, @Req() req: Request, @Res() res: Response) {
  try {
    const { MotDePasseN } = resetPassConfirmationDto;
    const email = req.query.email as string; // Récupérer l'e-mail à partir de la requête
    if (!email) throw new Error('Email not found in request');
    await this.authService.resetPassConfirmation(MotDePasseN, email);
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

@Post('reset-pass-demand-expert')
async resetPassDemandAdmin(@Body() resetPassDemandDto: ResetPasseDemandDto, @Res() res: Response) {
  try {
    await this.authService.resetPassDemandExpert(resetPassDemandDto.email);
    return res.status(200).json({ message: 'Reset password email has been sent' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


@Post('reset-pass-verification-expert')
async validateResetCodeExpert(@Body() validatePassCodeDto: ValidatePassCodeDto, @Res() res: Response, @Req() req:Request) {
try {
  const result = await this.authService.validatePasswordResetCodeExpert(validatePassCodeDto.code ,req );
  if ('error' in result) {
      return res.status(401).json({ message: result.error });
  } else {
      //const email = this.authService.getEmailFromResetUrl(req);
      // Continuer avec le reste du code en utilisant l'email récupéré et le code validé
      return res.status(200).json({ message: 'Reset code validated successfully' });
  }
} catch (error) {
  return res.status(401).json({ message: error.message });
}
}

@Post('reset-pass-confirmation-expert')
async resetPassConfirmationExpert(@Body() resetPassConfirmationDto: ResetPasseConfirmationDto, @Req() req: Request, @Res() res: Response) {
try {
  const { MotDePasseN } = resetPassConfirmationDto;
  const email = req.query.email as string; // Récupérer l'e-mail à partir de la requête
  if (!email) throw new Error('Email not found in request');
  await this.authService.resetPassConfirmationExpert(MotDePasseN, email);
  return res.status(200).json({ message: 'Password reset successful' });
} catch (error) {
  return res.status(500).json({ message: error.message });
}
}

}
