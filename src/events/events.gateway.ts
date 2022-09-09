import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ChatRequest = {
  userName: string;
  time: string;
  body: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  @SubscribeMessage('clientToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatRequest,
  ): void {
    this.logger.log(`message received ${JSON.stringify(payload)}`);
    this.server.emit('serverToClient', {
      ...payload,
      socketId: client.id,
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
  }
}
