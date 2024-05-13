import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InscriptionDto } from 'dto/inscriptionDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { MailerService } from 'src/mailer/mailer.service';
import { connexionDto } from 'dto/connexionDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
//import { DeleteAccountDto } from 'dto/deleteAccountDto';
import { Request, Response} from 'express';

@Injectable()
export class AuthService {


    constructor(private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly JwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,) { }
        async inscription(inscriptionDto: InscriptionDto) {

            const { Nom, Prenom, NumTel, Adresse, Ville, email, MotDePasse, CodePostal, PhotoProfil } = inscriptionDto
            //**vérification de user : déja inscrit ou non */
            const user = await this.prismaService.user.findUnique({ where: { email } });
            if (user) throw new ConflictException('Utilisateur déja exist !');
            //**vérification de mot de passe et de sa confirmation */
            //if (MotDePasse !== MotDePasseConfirmation) throw new BadRequestException('Les mots de passe ne correspondent pas');
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
            //await this.mailerService.sendInscriptionConfirmation(inscriptionDto.email);
            const payload = {
                sub: newUser.id,
                email: newUser.email
            }
            const token = this.JwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('SECRET_KEY') });
            //**retourner une réponse de succès */
            //return { data: 'Utilisateur enregistré ' };
            return { message: "Utilisateur enregistré et connecté", user: newUser, token };
        }
    async connexion(connexionDto: connexionDto) {
        const { email, MotDePasse } = connexionDto;
        // Recherche de l'utilisateur dans la base de données
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // Vérification du mot de passe
        const match = await bcrypt.compare(MotDePasse, user.MotDePasse);
        if (!match) {
            throw new ForbiddenException("Incorrect password");
        }
        // Génération du token JWT
        const payload = {
            sub: user.id,
            email: user.email,
    
        };
        const token = this.JwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('SECRET_KEY') });
        // Retour de la réponse avec le token JWT et les informations de l'utilisateur
        return {
            token,
            user: {
                id: user.id, // Assurez-vous que l'identifiant de l'utilisateur est inclus dans la réponse
                email: user.email
            }
        };
    }
    async connexionAdmin(connexionDto: connexionDto) {
        const { email, MotDePasse } = connexionDto;
        // Recherche de l'utilisateur dans la base de données
        const admin = await this.prismaService.admin.findUnique({ where: { email} });
        if (!admin || !admin.isAdmin) { // Vérifier si l'utilisateur est administrateur
            throw new ForbiddenException('Only administrators can access this endpoint');
          }
        // Vérification du mot de passe
        const match = await bcrypt.compare(MotDePasse, admin.MotDePasse);
        if (!match) {
            throw new ForbiddenException("Incorrect password");
        }

        // Génération du token JWT
        const payload = {
            sub: admin.ida,
            email: admin.email,
            isAdmin: admin.isAdmin,
            ida: admin.ida
    
        };
        const token = this.JwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('SECRET_KEY') });

        // Retour de la réponse avec le token JWT et les informations de l'utilisateur
        return {
            token,
            admin: {
                ida: admin.ida, // Assurez-vous que l'identifiant de l'utilisateur est inclus dans la réponse
                email: admin.email
            }
        };
    }
    async connexionExpert(connexionDto: connexionDto) {
        const { email, MotDePasse } = connexionDto;
        // Recherche de l'utilisateur dans la base de données
        const expert = await this.prismaService.expert.findUnique({ where: { email} });
        if (!expert || !expert.isExpert) { // Vérifier si l'utilisateur est administrateur
            throw new ForbiddenException('Only experts can access this endpoint');
          }
        // Vérification du mot de passe
        const match = await bcrypt.compare(MotDePasse, expert.passe);
        if (!match) {
            throw new ForbiddenException("Incorrect password");
        }

        // Génération du token JWT
        const payload = {
            sub: expert.ide,
            email: expert.email,
            isExpert: expert.isExpert,
            ide: expert.ide
    
        };
        const token = this.JwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('SECRET_KEY') });

        // Retour de la réponse avec le token JWT et les informations de l'utilisateur
        return {
            token,
            expert: {
                ide: expert.ide, // Assurez-vous que l'identifiant de l'utilisateur est inclus dans la réponse
                email: expert.email
            }
        };
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

       // const url = 'http://localhost:3000/auth/reset-pass-confirmation';
       const url = `http://localhost:3000/auth/reset-pass-confirmation?email=${email}&code=${code}`;
       await this.mailerService.sendResetPass(email, url, code);
    }
  1

      async validatePasswordResetCode(code: string ,req :Request): Promise<{ data: string } | { error: string }> {
         const  email  = this.getEmailFromResetUrl(req);
        /* Récupérer l'email à partir de la demande de réinitialisation */
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
   
    async resetPassConfirmation(MotDePasseN: string, email: string): Promise<void> {
        const hash = await bcrypt.hash(MotDePasseN, 10);
        await this.prismaService.user.update({
          where: { email },
          data: { MotDePasse: hash },
        });
      }
      
    getEmailFromResetUrl(req: Request): string {
        const email = req.query.email as string; // Récupérer l'email à partir de req.query.email
        if (!email) throw new Error('Email not found in reset URL');
        return email;
    }

    async resetPassDemandExpert(email: string): Promise<void> {
        const expert = await this.prismaService.expert.findUnique({ where: { email } });
        if (!expert) throw new NotFoundException('User not found');

        // Générer un code à 5 chiffres qui expire toutes les 15 minutes
        const code = speakeasy.totp({
            secret: this.configService.get('OTP_CODE'),
            digits: 5,
            step: 60 * 15,
            encoding: 'base32'
        });

       // const url = 'http://localhost:3000/auth/reset-pass-confirmation';
       const url = `http://localhost:3000/auth/reset-pass-confirmation?email=${email}&code=${code}`;
       await this.mailerService.sendResetPass(email, url, code);
    }
  
  
      async validatePasswordResetCodeExpert(code: string ,req :Request): Promise<{ data: string } | { error: string }> {
         const  email  = this.getEmailFromResetUrl(req);
        /* Récupérer l'email à partir de la demande de réinitialisation */
        const expert = await this.prismaService.expert.findUnique({ where: { email } });
        if (!expert) throw new NotFoundException('User not found');

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
   
    async resetPassConfirmationExpert(MotDePasseN: string, email: string): Promise<void> {
        const hash = await bcrypt.hash(MotDePasseN, 10);
        await this.prismaService.expert.update({
          where: { email },
          data: { passe: hash },
        });
      }
      

   
}
