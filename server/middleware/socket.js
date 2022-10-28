import { Server } from 'socket.io';
import WsEvent from '../models/ws_event';

export default defineEventHandler((event) => {
  if (globalThis.$io) return ;
  globalThis.$io = new Server(event.req.socket?.server);


  // Example: welcome message
  $io.on('connection', (sock) => {
    sock.emit('message', 'Welcome');
    sock.on('message', (msg) => {
      console.log(event.context.user);
      const wsEvent = WsEvent.createFromMessage(msg);
      console.log(wsEvent.userId);
    });
  });
})