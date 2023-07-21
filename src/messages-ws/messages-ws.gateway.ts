import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

// Un "Gateway" en Websockets es el equivalente al "controller" en un RESTFUL API

@WebSocketGateway({
  cors: true,
  // namespace: '/', // Si no se especifica apunta al root de la app
})
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server; // Tiene toda la info de los clientes conectados

  constructor(private readonly messagesWsService: MessagesWsService) {}

  //
  handleConnection(client: Socket) {
    // !Notas importantes:
    // client.join('chat'); // unir al cliente en la sala "chat"
    // this.wss
    //   .to('chat')
    //   .emit('mensaje a todos los que están conectados en la sala chat');
    // client.join(client.id); // los clientes SIEMPRE se unen la la sala de su ID
    // client.join(user.email); // Unir al cliente por un identificador unico como su email

    // console.log('cliente conectado:', client.id);
    this.messagesWsService.registerClient(client);

    // console.log(
    //   'Clientes conectados: ',
    //   this.messagesWsService.getConnectedClients(),
    // );

    // Emitir a todos los clients la lista de clientes conectados
    this.wss.emit(
      'clients-updates',
      this.messagesWsService.getConnectedClients(),
    );
  }

  //
  handleDisconnect(client: Socket) {
    // console.log('cliente desconectado:', client.id);
    this.messagesWsService.removeClient(client.id);

    // console.log(
    //   'Clientes conectados: ',
    //   this.messagesWsService.getConnectedClients(),
    // );

    // Emitir a todos los clients la lista de clientes conectados
    this.wss.emit(
      'clients-updates',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log({ clientId: client.id, payload });

    //? Emitir unicamente al client que envió el mensaje:
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'Ningún mensaje enviado',
    // });

    //? Emitir a todos menos al client que envio el mensaje:
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'Ningún mensaje enviado',
    // });

    //? Emitir a todos incluyendo al client que envio el mensaje:
    this.wss.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'Ningún mensaje enviado',
    });
  }
}
