import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { InscriptionDto } from 'dto/inscriptionDto';
import { AuthService } from './auth.service';
import { connexionDto } from 'dto/connexionDto';
import { ResetPasseDemandDto } from 'dto/resetPassDemandDto';
import { ResetPasseConfirmationDto } from 'dto/resetPasseConfirmationDto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { request } from 'http';
import { Response } from '@nestjs/common'
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
    //@UseGuards(AuthGuard('jwt'))
    @Post('reset-pass-demand')
   
    async resetPasseDemand(@Body() resetPasseDemandDto: ResetPasseDemandDto, @Res() res: Response) {
      try {
        const result = await this.authService.resetPasseDemand(resetPasseDemandDto);
        return { message: "Reset pass mail has been sent", result };
      } catch (error) {
        return { message: error.message };
      }
    }
  
    @Post('reset-pass-verification')
    //@UseGuards(AuthGuard('jwt'))
    async resetPasseVerification(
      @Body() validatePassCodeDto: ValidatePassCodeDto,
      @Res() res: Response,
    ) {
      try {
        const result = await this.authService.validatePasswordResetCode(validatePassCodeDto);
        return { message: "Password reset code is valid", result };
      } catch (error) {
        return { message: error.message };
      }
    }
  
    @Post('reset-pass-confirmation')
    //@UseGuards(AuthGuard('jwt'))
    async resetPasseConfirmation(
      @Body() resetPasseConfirmationDto: ResetPasseConfirmationDto,
      @Res() res: Response,
    ) {
      try {
        const result = await this.authService.resetPasseConfirmation(resetPasseConfirmationDto);
        return { message: "Mot De Passe updated", result };
      } catch (error) {
        return { message: error.message };
      }
    }
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

    }
