import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { DeleteAccountDto } from 'dto/deleteAccountDto';
import * as bcrypt from 'bcrypt';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { User } from '@prisma/client';
import path from 'path';
import * as fs from 'fs';
export interface UserWithoutPassword extends Omit<User, 'MotDePasse'> { }
@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService,) { }
    async getUserById(userId: number): Promise<UserWithoutPassword> {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // Exclure le champ MotDePasse de l'objet retourné
        const { MotDePasse, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async associateProfileImage(user: User, profileImage: string): Promise<void> {
        // Recherche de l'utilisateur par ID
        const existingUser = await this.prismaService.user.findUnique({ where: { id: user.id } });

        // Vérifier si l'utilisateur existe
        if (!existingUser) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        // Mettre à jour l'utilisateur avec la photo de profil
        await this.prismaService.user.update({
            where: { id: user.id },
            data: { PhotoProfil: profileImage },
        });
    }
    /**async associateProfileImage(userId: number, PhotoProfil : string): Promise<void> {
        const existingUser = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
          // Gérer le cas où l'utilisateur n'existe pas
        }
        if (existingUser.PhotoProfil) {
          // Gérer le cas où l'utilisateur a déjà une photo de profil
        }
        await this.prismaService.user.update({
          where: { id: userId },
          data: {PhotoProfil  },
        });
      }*/
    async deleteAccount(userId: number) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!user) throw new NotFoundException('User not found')
        await this.prismaService.user.delete({ where: { id: userId } });
        return { data: " User successfully deleted " }
    }
    /*async deleteAccount(userId: number) {
       const user = await this.prismaService.user.findUnique({ where: { id: userId } });
       if (!user) {
           throw new NotFoundException('Utilisateur non trouvé');
       }
       // Supprimer l'utilisateur de la base de données
       await this.prismaService.user.delete({ where: { id: userId } });
       // Retourner un message de confirmation
       return { message: 'Compte utilisateur supprimé avec succès' };
   }*/
    async updateAccount(userId: number, updateAccountDto: UpdateAccountDto) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!user) throw new NotFoundException('User not found')
        let updateAccount: User
        if (updateAccountDto.MotDePasse) {
            const hash = await bcrypt.hash(updateAccountDto.MotDePasse, 10);
            updateAccount = await this.prismaService.user.update({
                where: { id: userId },
                data: { ...updateAccountDto, MotDePasse: hash },
            });
        }
        else {
            // Si le mot de passe n'est pas fourni, mettez à jour les autres champs sans toucher au mot de passe
            updateAccount = await this.prismaService.user.update({
                where: { id: userId },
                data: { ...updateAccountDto },
            });
        }
        return { message: 'Compte utilisateur mis à jour avec succès.' };

    }
    async getProfileImageName(userId: number) {
        // Recherchez l'utilisateur dans la base de données en fonction de son ID
        try {
            // Recherchez l'utilisateur dans la base de données en fonction de son ID
            const user = this.prismaService.user.findUnique({
                where: { id: userId },
                select: { PhotoProfil: true } // Sélectionnez uniquement le champ PhotoProfil
            });

            if (!user || !(await user).PhotoProfil) {
                throw new NotFoundException('Image de profil non trouvée pour cet utilisateur');
            }

            // Retournez le nom de l'image de profil
            return (await user).PhotoProfil;
        } catch (error) {
            throw error;
        }
    }
    async updateProfileImage(userId: number, filename: string): Promise<Object> {
        // Recherche de l'utilisateur dans la base de données
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!user) {
            // Gérer le cas où l'utilisateur n'est pas trouvé
            throw new NotFoundException('User not found');
        }

        try {
            // Mettre à jour la colonne PhotoProfil de l'utilisateur avec le nom du fichier
            const updatedUser = await this.prismaService.user.update({
                where: { id: userId },
                data: { PhotoProfil: filename },
            });

            return { message: 'Profile image updated successfully' };
        } catch (error) {
            // Gérer les erreurs potentielles
            throw new Error('Failed to update profile image');
        }
    }


}
