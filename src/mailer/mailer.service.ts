// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer'
// @Injectable()
// export class MailerService {
//     private async transporter() {
//         const testAccount = await nodemailer.createTestAccount()
//         const transport = nodemailer.createTransport({
//             host: "gmail",
//             port: 1025,
//             ignoreTLS: true,
//             auth: {
//                 user: testAccount.user, // generated ethereal user
//                 pass: testAccount.pass // generated ethereal password
//             }
//         })
//         return transport
//     }
//     async sendInscriptionConfirmation(userEmail: string) {
//         (await this.transporter()).sendMail({
//             from: "app@localhost.com",
//             to: userEmail,
//             subject: "Inscription",
//             html: "<h3>Confirmation d'inscription</h3>"
//         })

//     }
//     async sendResetPassRequest(userEmail: string, code: string) {
//         const url = ""; // Votre URL de réinitialisation de mot de passe si nécessaire
//         const transport = await this.transporter();
//         await transport.sendMail({
//             from: "app@localhost.com",
//             to: userEmail,
//             subject: "Demande de réinitialisation de mot de passe",
//             html: `<a href="${url}">Réinitialiser le mot de passe</a><br><h6>Code de confirmation: <strong>${code}</strong></h6>
//             <p>Le code expirera dans 15 minutes</p>`,
//         });
//     }

//     async sendResetPassConfirmationCode(userEmail: string, code: string) {
//         const transport = await this.transporter();
//         await transport.sendMail({
//             from: "app@localhost.com",
//             to: userEmail,
//             subject: "Vérification du code de réinitialisation de mot de passe",
//             html: `<h3>Veuillez saisir le code de vérification pour réinitialiser votre mot de passe.</h3><br><h6>Code de confirmation: <strong>${code}</strong></h6>`,
//         });
//     }
//     async sendResetPass(userEmail: string, url: string, code: string): Promise<void> {
//         const transport = await this.transporter();
//         await transport.sendMail({
//             from: 'app@localhost.com',
//             to: userEmail,
//             subject: 'Demande de réinitialisation de mot de passe',
//             html: `<p>Vous avez demandé une réinitialisation de mot de passe.</p>
//                    <p>Veuillez <a href="${url}?code=${code}">cliquer ici</a> pour réinitialiser votre mot de passe.</p>
//                    <p>Votre code de vérification est : ${code}</p>
//                    <p>Le code expirera dans 15 minutes.</p>`
//         });
//     }
//    /* async sendResetPass(userEmail: string, url: string, //code: string
//     ) {
//         (await this.transporter()).sendMail({
//             from: "app@localhost.com",
//             to: userEmail,
//             subject: "reset password",
//             html: `<a href="${url}">Reset Password</a><br><h6>Code de confirmation: <strong>${code}</strong></h6>
//             <p>Code will expire in 15 minutes</p>`,

//         });
//     }*/
// }

import { Injectable } from '@nestjs/common';
import { FormExpertDto } from 'dto/formExpertDto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async transporter() {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yahyaouiad28@gmail.com',
        pass: 'hewr kyyd chea ddmh',
      },
    });
    return transport;
  }

  async sendInscriptionConfirmation(userEmail: string) {
    (await this.transporter()).sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: 'Inscription',
      html: "<h3>Confirmation d'inscription</h3>",
    });
  }

  async sendResetPassRequest(userEmail: string, code: string) {
    const url = ''; // Your password reset URL if necessary
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: 'Demande de réinitialisation de mot de passe',
      html: `<a href="${url}">Réinitialiser le mot de passe</a><br><h6>Code de confirmation: <strong>${code}</strong></h6>
            <p>Le code expirera dans 15 minutes</p>`,
    });
  }

  async sendResetPassConfirmationCode(userEmail: string, code: string) {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: 'Vérification du code de réinitialisation de mot de passe',
      html: `<h3>Veuillez saisir le code de vérification pour réinitialiser votre mot de passe.</h3><br><h6>Code de confirmation: <strong>${code}</strong></h6>`,
    });
  }

  async sendResetPass(
    userEmail: string,
    url: string,
    code: string,
  ): Promise<void> {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: 'Demande de réinitialisation de mot de passe',
      html: `<p>Vous avez demandé une réinitialisation de mot de passe.</p>
                   <p>Veuillez <a href="${url}?code=${code}">cliquer ici</a> pour réinitialiser votre mot de passe.</p>
                   <p>Votre code de vérification est : ${code}</p>
                   <p>Le code expirera dans 15 minutes.</p>`,
    });
  }
  async sendExpertDemand(
    formExpertDto: FormExpertDto,
    cv?: Express.Multer.File,
  ) {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: 'admin@example.com',
      subject: "Nouvelle demande d'expert",
      html: `<p>Un nouveau visiteur a demandé à devenir expert.</p>
                 <p>Voici ses informations:</p>
                 <ul>
                   <li>Nom: ${formExpertDto.firstName}</li>
                   <li>Prénom: ${formExpertDto.lastName}</li>
                   <li>Téléphone: ${formExpertDto.tel}</li>
                   <li>Ville: ${formExpertDto.city}</li>
                 </ul>
                 <p>Vous pouvez consulter sa demande en cliquant <a href="${process.env.ADMIN_URL}/experts/demands">ici</a>.</p>`,
    });
  }

  async sendExpertAcceptanceEmail(
    userEmail: string,
    userPassword: string,
  ): Promise<void> {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: "Confirmation d'acceptation en tant qu'expert",
      html: `<p>Votre demande pour devenir expert a été acceptée.</p>
                   <p>Votre adresse e-mail: ${userEmail}</p>
                   <p>Votre mot de passe: ${userPassword}</p>
                   <p>Vous pouvez maintenant vous connecter en utilisant votre adresse e-mail comme identifiant et votre mot de passe.</p>`,
    });
  }

  async sendExpertRefusalEmail(userEmail: string): Promise<void> {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: "Refus de la demande d'expertise",
      html: "<p>Votre demande pour devenir expert a été refusée par l'administrateur.</p>",
    });
  }

  async sendDemandeRefuseeEmail(userEmail: string) {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: 'Demande de création de compte refusée',
      text: 'Votre demande de création de compte a été refusée.',
      html: '<b>Votre demande de création de compte a été refusée.</b>',
    });
  }

  async sendCreationCompteEmail(userEmail: string, userPassword: string) {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: 'Compte créé avec succès',
      html: `<p>Votre compte a été créé avec succès..</p>
            <p>Vos Vos identifiants sont : </p>
                   <p>Votre adresse e-mail: ${userEmail}</p>
                   <p>Votre mot de passe: ${userPassword}</p>`,
    });
  }
//jdidd
  async sendPaymentSuccessEmail(
    userEmail: string,
    publicationTitle: string,
    paymentAmount: number
  ): Promise<void> {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: userEmail,
      subject: "Paiement réussi pour votre publication",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Paiement réussi</h1>
          <p style="color: #666; font-size: 16px;">Bonjour,</p>
          <p style="color: #666; font-size: 16px;">Nous vous confirmons que le paiement de <strong>${paymentAmount} DT</strong> pour votre publication "<strong>${publicationTitle}</strong>" a été effectué avec succès.</p>
          <p style="color: #666; font-size: 16px;">Vous pouvez désormais accéder à votre espace personnel pour gérer votre publication.</p>
          <p style="color: #666; font-size: 16px;">Merci pour votre confiance.</p>
          <p style="color: #666; font-size: 16px;">L'équipe de notre service.</p>
        </div>
      `
    });
  }
  async sendPaymentSuccessEmailExpert(
    expertEmail: string,
    paymentAmount: number,
    marque: string,
    model: string,
    clientFirstName: string,
    clientLastName: string
  ): Promise<void> {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'yahyaouiad28@gmail.com',
      to: expertEmail,
      subject: "Paiement reçu pour expertise de véhicule",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Paiement reçu pour expertise de véhicule</h1>
          <p style="color: #666; font-size: 16px;">Bonjour,</p>
          <p style="color: #666; font-size: 16px;">Nous vous informons qu'un paiement de <strong>${paymentAmount} DT</strong> a été effectué pour l'expertise d'un véhicule de marque <strong>${marque}</strong> et de modèle <strong>${model}</strong>.</p>
          <p style="color: #666; font-size: 16px;">Le paiement a été effectué par <strong>${clientFirstName} ${clientLastName}</strong>.</p>
          <p style="color: #666; font-size: 16px;">Merci pour votre travail.</p>
          <p style="color: #666; font-size: 16px;">Cordialement,</p>
          <p style="color: #666; font-size: 16px;">Votre service.</p>
        </div>
      `
    });
  }
}
