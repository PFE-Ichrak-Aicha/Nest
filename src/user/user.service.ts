import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { DeleteAccountDto } from 'dto/deleteAccountDto';
import * as bcrypt from 'bcrypt';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { User } from '@prisma/client';
@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService,) { }

    async deleteAccount(userId: any, deleteAccountDto: DeleteAccountDto) {
        const { MotDePasse } = deleteAccountDto
        const user = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!user) throw new NotFoundException('User not found')
        const match = await bcrypt.compare(MotDePasse, user.MotDePasse);
        if (!match) throw new ForbiddenException("Mot De Passe Incorrect")
        await this.prismaService.user.delete({ where: { id: userId } });
        return { data: " User successfully deleted " }
    }
    async updateAccount(userId: any, updateAccountDto: UpdateAccountDto) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!user) throw new NotFoundException('User not found')
        let updateAccount: User
        if (updateAccountDto.MotDePasse) {
            const hash = await bcrypt.hash(updateAccountDto.MotDePasse,10);
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
        return { message: 'Compte utilisateur mis à jour avec succès.'  };
    
    }
}
