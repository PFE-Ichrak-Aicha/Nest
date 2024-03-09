import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InscriptionDto } from 'dto/inscriptionDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { MailerService } from 'src/mailer/mailer.service';
import { connexionDto } from 'dto/connexionDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasseDemandDto } from 'dto/resetPassDemandDto';
import { ResetPasseConfirmationDto } from 'dto/resetPasseConfirmationDto';
import { UserService } from 'src/user/user.service';
import { ValidatePassCodeDto } from 'dto/validatePassCodeDto';
//import { DeleteAccountDto } from 'dto/deleteAccountDto';
@Injectable()
export class AuthService {


    constructor(private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly JwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,) { }
    async inscription(inscriptionDto: InscriptionDto) {

        const { Nom, Prenom, NumTel, Adresse, Ville, email, MotDePasse, CodePostal, PhotoProfil, MotDePasseConfirmation } = inscriptionDto
        //**vérification de user : déja inscrit ou non */
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (user) throw new ConflictException('Utilisateur déja exist !');
        //**vérification de mot de passe et de sa confirmation */
        if (MotDePasse !== MotDePasseConfirmation) throw new BadRequestException('Les mots de passe ne correspondent pas');
        //** hasher mdp*/
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(inscriptionDto.MotDePasse, salt);
        const userExists = await this.prismaService.user.findUnique({ where: { email } });
        if (userExists) throw new ConflictException('Utilisateur déja exist !');
        const newUser = await this.prismaService.user.create({
            data: {
                Nom,
                Prenom,
                NumTel,
                Adresse,
                Ville,
                email,
                MotDePasse: hash,
                CodePostal,
                PhotoProfil: PhotoProfil ? PhotoProfil : null,
            },
        });
        // if (PhotoProfil) {
        //await this.userService.associateProfileImage(newUser.id, PhotoProfil);
        //}
        //**Envoyer un email de confirmation */
        await this.mailerService.sendInscriptionConfirmation(inscriptionDto.email);
        const payload = {
            sub: newUser.id,
            email: newUser.email
        }
        const token = this.JwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('SECRET_KEY') });
        //**retourner une réponse de succès */
        //return { data: 'Utilisateur enregistré ' };
        //const connectedUser = await this.connexion({ email, MotDePasse: inscriptionDto.MotDePasse }, token);
        return { message: "Utilisateur enregistré et connecté", user: newUser, token };
    }
    async connexion(connexionDto: connexionDto) {
        const { email, MotDePasse } = connexionDto
        //** nvirifo sa3a kan user inscrit wala */
        const user = await this.prismaService.user.findUnique({ where: { email } })
        if (!user) throw new NotFoundException('User not found')
        //**ncomparo l pass */
        const match = await bcrypt.compare(MotDePasse, user.MotDePasse);
        if (!match) throw new ForbiddenException("Mot De Passe Incorrect")
        //if (token) {
        const payload = { sub: user.id, email: user.email };
        //** verifier la validité du token */
        // const decoded = this.JwtService.verify(token, { secret: this.configService.get('SECRET_KEY') });
        //if (decoded.sub === payload.sub && decoded.email === payload.email) {
        // return { message: "Utilisateur connecté", user };
        //} else {
        //throw new ForbiddenException("Token invalide");
        //}
        const token = this.JwtService.sign(payload, {
            expiresIn: '2h',
            secret: this.configService.get('SECRET_KEY'),
        });
        return {
            id: user.id,
            email: user.email,
            token,
        };
        //**retourne token */
        //const payload = {
        //sub: user.id,
        // email: user.email
        //}
        //const token = this.JwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('SECRET_KEY') });
        //return {
        //token, user: {
        //     email: user.email
        //   },
        // };
    }
    async resetPassDemand(email: string): Promise<void> {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        // Générer un code à 5 chiffres qui expire toutes les 15 minutes
        const code = speakeasy.totp({
            secret: this.configService.get('OTP_CODE'),
            digits: 5,
            step: 60 * 15,
            encoding: 'base32'
        });

        const url = 'http://localhost:3000/auth/reset-pass-confirmation';
        await this.mailerService.sendResetPass(email, url, code);
    }

    /*async validatePasswordResetCode(validatePassCodeDto: ValidatePassCodeDto): Promise<{ data: string }> {
        const { code, email } = validatePassCodeDto;
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        // Vous devrez stocker le code généré précédemment lors de l'envoi du courrier électronique
        // et le comparer ici avec le code entré par l'utilisateur
        if (!user) throw new NotFoundException('User not found')
        const match = speakeasy.totp.verify({
            secret: this.configService.get('OTP_CODE'),
            token: code,
            digits: 5,
            step: 60 * 15,
            encoding: 'base32',
        })
        if (!match) throw new UnauthorizedException("Invalid token")
        //const hash = await bcrypt.hash(MotDePasse, 10)
        //await this.prismaService.user.update({ where: { email }, data: { MotDePasse: hash } })
        return { data: "Mot De Passe updated " }


        //if (!isValid) throw new UnauthorizedException('Invalid reset code');
        //const hash = await bcrypt.hash(MotDePasse, 10)
        //await this.prismaService.user.update({ where: { email }})
        /* const isValid = speakeasy.totp.verify({
             secret: this.configService.get('OTP_CODE'),
             encoding: 'base32',
             token: code,
             window: 10 // Permet une marge d'erreur d'une unité de temps (par exemple, une minute) pour les codes générés
         });*/
        // if (code !==  user.resetCode) throw new UnauthorizedException('Invalid reset code');}
        async validatePasswordResetCode(validatePassCodeDto: ValidatePassCodeDto): Promise<{ data: string } | { error: string }> {
            const { code, email } = validatePassCodeDto;
            const user = await this.prismaService.user.findUnique({ where: { email } });
            if (!user) throw new NotFoundException('User not found');
        
            const isValid = speakeasy.totp.verify({
              secret: this.configService.get('OTP_CODE'),
              token: code,
              digits: 5,
              step: 60 * 15,
              encoding: 'base32',
            });
        
            if (!isValid) return { error: 'Invalid code' };
        
            return { data: 'Code is valid. You can now reset your password.' };
          }
    async resetPassConfirmation(resetPassConfirmationDto: ResetPasseConfirmationDto): Promise<void> {
        const { email, MotDePasseN, code } = resetPassConfirmationDto;
        await this.validatePasswordResetCode({ code: code, email });
        const hash = await bcrypt.hash(MotDePasseN, 10);
        await this.prismaService.user.update({
            where: { email },
            data: { MotDePasse: hash },
        });
    }
    /*async resetPasseDemand(resetPasseDemandDto: ResetPasseDemandDto) {
        const { email } = resetPasseDemandDto;
        const code = speakeasy.totp({
          secret: this.configService.get("OTP_SECRET"),
          digits: 5,
          step: 60 * 15,
          encoding: "base32"
        });
        await this.mailerService.sendResetPassRequest(email, code);
        return { data: "Reset pass mail has been sent" };
      }*/
    /* async resetPasseDemand(email: string) {
         const user = await this.prismaService.user.findUnique({ where: { email } });
         if (!user) throw new NotFoundException('User not found');
 
         const code = this.generateResetCode();
         await this.mailerService.sendResetCode(email, code);
     }
 
     async validatePasswordResetCode(validatePassCodeDto: ValidatePassCodeDto) {
         const { code, email } = validatePassCodeDto;
         const user = await this.prismaService.user.findUnique({ where: { email } });
         if (!user) throw new NotFoundException('User not found');
 
         const expectedCode = this.generateResetCode();
         if (code !== expectedCode) throw new UnauthorizedException('Invalid reset code');
     }
     async resetPasseConfirmation(resetPasseConfirmationDto: ResetPasseConfirmationDto) {
         const { email, MotDePasseN } = resetPasseConfirmationDto;
         ////const secret = this.configService.get("OTP_SECRET");
         //const token = speakeasy.totp({ secret, encoding: "base32" });
         //if (token !== code) throw new UnauthorizedException("Invalid token");
         const hash = await bcrypt.hash(MotDePasseN, 10);
         await this.prismaService.user.update({
             where: { email },
             data: { MotDePasse: hash }
         });
         return { data: "Mot De Passe updated " };
     }
     /* async resetPasseDemand(resetPasseDemandDto: ResetPasseDemandDto) {
          const { email } = resetPasseDemandDto;
          const user = await this.prismaService.user.findUnique({ where: { email } })
          if (!user) throw new NotFoundException('User not found')
          const code = speakeasy.totp({
              secret: this.configService.get("OTP_CODE"),
              digits: 5,
              step: 60 * 15,
              encoding: "base32"
          })
          const url = "http://localhost:3000/auth/reset-pass-confirmation"
          await this.mailerService.sendResetPass(email, url, code);
          return { data: "Reset pass mail has been sent" }
  
      }
  
      async resetPasseConfirmation(resetPasseConfirmationDto: ResetPasseConfirmationDto) {
          const { code, email, MotDePasse } = resetPasseConfirmationDto
          const user = await this.prismaService.user.findUnique({ where: { email } })
          if (!user) throw new NotFoundException('User not found')
          const match = speakeasy.totp.verify({
              secret: this.configService.get('OTP_CODE'),
              token: code,
              digits: 5,
              step: 60 * 15,
              encoding: 'base32',
          })
          if (!match) throw new UnauthorizedException("Invalid token")
          const hash = await bcrypt.hash(MotDePasse, 10)
          await this.prismaService.user.update({ where: { email }, data: { MotDePasse: hash } })
          return { data: "Mot De Passe updated " }
      }*/
    /*
    async deleteAccount(userId: any, deleteAccountDto: DeleteAccountDto) {
        const { MotDePasse } = deleteAccountDto
        const user = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!user) throw new NotFoundException('User not found')
        const match = await bcrypt.compare(MotDePasse, user.MotDePasse);
        if (!match) throw new ForbiddenException("Mot De Passe Incorrect")
        await this.prismaService.user.delete({ where: { id: userId } });
        return { data: " User successfully deleted " }
    }*/
}
