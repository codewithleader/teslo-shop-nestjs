import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

// Un "Gateway" en Websockets es el equivalente al "controller" en un RESTFUL API

@WebSocketGateway(3000, {
  cors: true,
  // namespace: '/', // Si no se especifica apunta al root de la app
})
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesWsService: MessagesWsService) {}

  //
  handleConnection(client: Socket) {
    console.log('cliente conectado:', client.id);
  }
  //
  handleDisconnect(client: Socket) {
    console.log('cliente desconectado:', client.id);
  }
}
