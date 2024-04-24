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
        const email = this.authService.getEmailFromResetUrl(req);
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

 /* @Post('reset-pass-verification')
  async validateResetCode(@Body() validatePassCodeDto: ValidatePassCodeDto, @Res() res: Response) {
    try {
      await this.authService.validatePasswordResetCode(validatePassCodeDto);
      return res.status(200).json({ message: 'Reset code validated successfully' });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
  

  @Post('reset-pass-confirmation')
  async resetPassConfirmation(@Body() resetPassConfirmationDto: ResetPasseConfirmationDto, @Res() res: Response) {
    try {
      await this.authService.resetPassConfirmation(resetPassConfirmationDto);
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }*/
  //@UseGuards(AuthGuard('jwt'))
  /*@Post('reset-pass-demand')
  async resetPasseDemand(@Body() resetPasseDemandDto: ResetPasseDemandDto, @Res() res: Response) {
    try {
      const result = await this.authService.resetPasseDemand(resetPasseDemandDto.email);
      return { message: "Reset pass mail has been sent", result };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('reset-pass-verification')
  async validateResetCode(@Body() validatePassCodeDto: ValidatePassCodeDto) {
    await this.authService.validatePasswordResetCode(validatePassCodeDto);
    return { message: 'Reset code validated successfully' };
  }

  /*async resetPasseVerification(
    @Body() validatePassCodeDto: ValidatePassCodeDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.validatePasswordResetCode(validatePassCodeDto);
      return { message: "Password reset code is valid", result };
    } catch (error) {
      return { message: error.message };
    }
  }*/

  /*@Post('reset-pass-confirmation')
  //@UseGuards(AuthGuard('jwt'))
  async resetPasseConfirmation(
    @Body() resetPasseConfirmationDto: ResetPasseConfirmationDto,
    //@Res() res: Response,
  ) {
    await this.authService.resetPasseConfirmation(resetPasseConfirmationDto);
    return { message: 'Password reset successful' };
  }*/
  /*@Post('reset-pass-confirmation')
  resetPasseConfirmation(@Body() resetPasseConfirmationDto: ResetPasseConfirmationDto) {
    return this.authService.resetPasseConfirmation(resetPasseConfirmationDto);
  }*/

  /*@UseGuards(AuthGuard ("jwt"))
  @Delete("delete-account")
  deleteAccount (@Req() request : Request , @Body() deleteAccountDto : DeleteAccountDto){
      const userId =  request.user ["id"]
      return this.authService.deleteAccount(userId , deleteAccountDto );}

  */
  /*
   @UseGuards(AuthGuard("jwt"))
   @Put("update-account/:id")
   update(@Param("id" , ParseIntPipe)
   @Body() updateAccountDto : UpdateAccountDto, 
   @Req() request: Request ) {
       const userId = request.user["id"]
       return this.authService.update( userId , updateAccountDto)
   }*/
   /*@Post('reset-pass-confirmation')
async resetPassConfirmation(@Body() resetPassConfirmationDto: ResetPasseConfirmationDto, @Res() res: Response) {
  try {
    await this.authService.resetPassConfirmation(resetPassConfirmationDto.MotDePasseN,resetPassConfirmationDto.email);
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}*/

}
