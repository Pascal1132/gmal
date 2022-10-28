import { Server } from 'socket.io';
import WsEvent from '../models/ws_event';
import { WSHandler } from '../utils/socket/ws_dispatcher';
const handler = new WSHandler();

export default defineEventHandler((event) => {
  if (globalThis.$io) return ;
  globalThis.$io = new Server(event.req.socket?.server);

  // Example: welcome message
  $io.on('connection', (sock) => {
    handler.initConnection(sock);
    sock.on('message', (msg) => {
      const wsEvent = WsEvent.createFromMessage(msg);
      handler.handle(wsEvent, sock);
    });
  });

  $io.on('disconnect', (sock) => {
    handler.onDisconnect(sock);
  });
})