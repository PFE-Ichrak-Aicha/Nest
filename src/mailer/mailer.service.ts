import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
@Injectable()
export class MailerService {
    private async transporter() {
        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        })
        return transport
    }
    async sendInscriptionConfirmation(userEmail: string) {
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "Inscription",
            html: "<h3>Confirmation d'inscription</h3>"
        })

    }
    async sendResetPassRequest(userEmail: string, code: string) {
        const url = ""; // Votre URL de réinitialisation de mot de passe si nécessaire
        const transport = await this.transporter();
        await transport.sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "Demande de réinitialisation de mot de passe",
            html: `<a href="${url}">Réinitialiser le mot de passe</a><br><h6>Code de confirmation: <strong>${code}</strong></h6>
            <p>Le code expirera dans 15 minutes</p>`,
        });
    }

    async sendResetPassConfirmationCode(userEmail: string, code: string) {
        const transport = await this.transporter();
        await transport.sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "Vérification du code de réinitialisation de mot de passe",
            html: `<h3>Veuillez saisir le code de vérification pour réinitialiser votre mot de passe.</h3><br><h6>Code de confirmation: <strong>${code}</strong></h6>`,
        });
    }

   /* async sendResetPass(userEmail: string, url: string, //code: string
    ) {
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "reset password",
            html: `<a href="${url}">Reset Password</a><br><h6>Code de confirmation: <strong>${code}</strong></h6>
            <p>Code will expire in 15 minutes</p>`,

        });
    }*/
}
