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
//import { DeleteAccountDto } from 'dto/deleteAccountDto';
@Injectable()
export class AuthService {


    constructor(private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly JwtService: JwtService,
        private readonly configService: ConfigService) { }
    async inscription(inscriptionDto: InscriptionDto) {
      
        const { Nom, Prenom, NumTel, Adresse, Ville, email, MotDePasse, CodePostal, PhotoProfil ,MotDePasseConfirmation } = inscriptionDto
        //**vérification de user : déja inscrit ou non */
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (user) throw new ConflictException('Utilisateur déja exist !');
        //**vérification de mot de passe et de sa confirmation */
  if (MotDePasse !== MotDePasseConfirmation) throw new BadRequestException('Les mots de passe ne correspondent pas');
        //** hasher mdp*/
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(inscriptionDto.MotDePasse, salt);
        await this.prismaService.user.create({
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
        //**Envoyer un email de confirmation */
        await this.mailerService.sendInscriptionConfirmation(inscriptionDto.email);
        //**retourner une réponse de succès */
        return { data: 'Utilisateur enregistré ' };
    }
    async connexion(connexionDto: connexionDto) {
        const { email, MotDePasse } = connexionDto
        //** nvirifo sa3a kan user inscrit wala */
        const user = await this.prismaService.user.findUnique({ where: { email } })
        if (!user) throw new NotFoundException('User not found')
        //**ncomparo l pass */
        const match = await bcrypt.compare(MotDePasse, user.MotDePasse);
        if (!match) throw new ForbiddenException("Mot De Passe Incorrect")
        //**retourne token */
        const payload = {
            sub: user.id,
            email: user.email
        }
        const token = this.JwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('SECRET_KEY') });
        return {
            token, user: {
                email: user.email
            },
        };
    }
    async resetPasseDemand(resetPasseDemandDto: ResetPasseDemandDto) {
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
    }
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
