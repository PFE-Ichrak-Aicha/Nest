import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { Notification } from "@prisma/client";
import { Admin } from "@prisma/client";

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;


  private connectedAdmins: Map<string, Admin> = new Map();
 
  handleConnection(client: Socket, @ConnectedSocket() admin: Admin) {
    // Stocker les informations de l'administrateur dans le contexte de la connexion
    this.connectedAdmins.set(client.id, admin);
  }


  handleDisconnect(client: Socket) {
    // Supprimer la connexion de l'administrateur
    this.connectedAdmins.delete(client.id);
  }


  @SubscribeMessage('sendNotificationToAdmin')
  sendNotificationToAdmin(content: any, client: Socket) {
    this.server.emit('notificationToAdmin', (res) => {
      console.log('notification send with success', content)
    });
  }
  

  @SubscribeMessage('sendNotificationToExpert')
  sendNotificationToExpert(content: any, client: Socket) {
    this.server.emit('notificationToExpert', (res) => {
      console.log('notification send with success', content);
    });
  }


  @SubscribeMessage('sendNotificationToUser')
  sendNotificationToUser(content: any, client : Socket){
    this.server.emit('notificationToUser',(res) =>{
      console.log('notification send with success' ,content)
    })
  }
  @SubscribeMessage('notifierAdmin')
  async notifierAdmin(content: any, client: Socket) {
   // const notification = await this.notificationService.createNotificationToAdmin(data);
    this.server.emit('notificationToAdmin', 'notificationToUser',(res) =>{
      console.log('notification send with success' ,content)
    })
  }
  @SubscribeMessage('notifierUtilisateur')
  async notifierUtilisateur(content: any,client: Socket) {
   // const { userId, content } = data;
this.server.emit('notificationToUser',(res) =>{
  console.log('notification send with success' ,content)
})
    // Envoyer la notification à l'utilisateur spécifié
    //this.server.to(`user-${userId}`).emit('notification', content);
  }
  
}