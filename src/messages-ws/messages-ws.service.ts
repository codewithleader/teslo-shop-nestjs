import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
//
import { User } from 'src/auth/entities/user.entity';

// .................

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
    // desktop: boolean;
    // movile: boolean;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');

    this.checkUserConnection(user); // Comprueba si hay una conexion anterior del mismo user

    this.connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    console.log(this.connectedClients);
    return Object.keys(this.connectedClients);
  }

  getUserFullNameBy(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }

  // Se desconectará la conexión anterior si es que la hay
  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect(); // desconecta el socket anterior
        break;
      }
    }
  }
}
