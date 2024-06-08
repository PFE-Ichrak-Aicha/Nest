import { Injectable } from '@nestjs/common';
import { PaymentDto } from 'dto/paymentDto';
import { ExpertService } from 'src/expert/expert.service';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51P6Y57F2WFtktG9h8tRz2DqgaFe38UoUsli5nvgwilTY6ikRwB20HrloHPzXaDRKZZc2j1MbeggWTD8oe1FeEsw000qtSxoHr3');
@Injectable()
export class StripeService {
    constructor(private readonly prisma: PrismaService, private mailerService : MailerService , private userS : UserService ,private expertS : ExpertService) {}


    async createStripe(userId: string, idde: string, ide: string ,  paymentData: PaymentDto): Promise<any> {
        try {
          const demandeExpertise = await this.prisma.demandExpertise.findFirst({
            where: {
              idde: parseInt(idde),
            },
          });
          if (!demandeExpertise) {
            console.log("Demande Expertise non trouvée.");
            return { error: "Demande Expertise non trouvée" };
          }
          
          // Créez une session de paiement avec Stripe
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'TND',
                  unit_amount: Math.round(paymentData.expert.cout * 1000), 
                  product_data: {
                    name: `${paymentData.expert.firstName} ${paymentData.expert.lastName}`,
                    description: `L'expertise de la ${paymentData.marque} ${paymentData.model} par ${paymentData.expert.firstName} ${paymentData.expert.lastName} est une analyse complète des caractéristiques et des performances de votre véhicule. Notre expert vous fournira un rapport détaillé sur l'état de votre voiture, mettant en évidence tout problème éventuel et fournissant des recommandations pour son entretien et sa réparation. Avec notre service d'expertise de haute qualité, vous pouvez être assuré que votre véhicule est entre de bonnes mains. Le coût de cette expertise est de ${paymentData.expert.cout} TND.`,
                  },
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: paymentData.successUrl,
            cancel_url: paymentData.urlCancel,
            client_reference_id:` ${userId}_${idde}`,
          });
      
          if (session) {
            // Mettez à jour la demande d'expertise pour marquer qu'elle a été payée
            const updatedDemandeExpertise = await this.prisma.demandExpertise.update({
              where: {
                idde: parseInt(idde),
              },
              data: {
                paye: paymentData.paye,
              },
            });
      
            // Récupérez l'e-mail de l'utilisateur pour envoyer la confirmation de paiement
            const userEmail = await this.userS.getEmailById(userId);
            if (!userEmail) {
              console.log("Impossible de récupérer l'email de l'utilisateur.");
              return { error: "Impossible de récupérer l'email de l'utilisateur" };
            }
      
            // Envoyez un e-mail de confirmation de paiement à l'utilisateur
            await this.mailerService.sendPaymentSuccessEmail(
              userEmail,
              `${paymentData.expert.firstName} ${paymentData.expert.lastName}`,
              paymentData.expert.cout // Utilisez le coût de l'expert dans l'e-mail de confirmation de paiement
            );
            const user = await this.userS.getUById(parseInt(userId));
            const expertDetails = await this.expertS.getExpertDetails(parseInt(ide));
            console.log(expertDetails)
    
            if (!expertDetails) {
              console.log("Impossible de récupérer les détails de l'expert.");
              return { error: "Impossible de récupérer les détails de l'expert" };
            }
        
            // Envoyez un e-mail de notification de paiement à l'expert
            await this.mailerService.sendPaymentSuccessEmailExpert(
              expertDetails.email,
              paymentData.expert.cout,
              paymentData.marque,
              paymentData.model,
              user.Nom, // Nom du client
              user.Prenom // Prénom du client
            );      
            return { url: session.url };
          } else {
            console.log("Échec de la création de la session de paiement.");
            return { error: "Échec de la création de la session de paiement" };
          }
        } catch (error) {
          console.error('Erreur lors de la création de la session Stripe:', error);
          return { error: "Erreur lors de la création de la session Stripe" };
        }
      }
        
}
