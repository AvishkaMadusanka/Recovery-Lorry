import http from 'node:http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, dbState } from './config/db.js';
import { setSocketIO } from './utils/socket.js';

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.clientUrl,
    credentials: true
  }
});
setSocketIO(io);

io.on('connection', (socket) => {
  socket.on('join-user-room', (userId) => {
    if (typeof userId === 'string' && userId.length > 0) {
      socket.join(`user:${userId}`);
    }
  });

  socket.on('join-booking-room', (bookingId) => {
    if (typeof bookingId === 'string' && bookingId.length > 0) {
      socket.join(`booking:${bookingId}`);
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  connectDatabase()
    .finally(() => {
      httpServer.listen(env.port, () => {
        console.log(`-----------------------------------------------------`);
        console.log(` RescueNow Sri Lanka API running on port ${env.port}`);
        console.log(` Database Mode: ${dbState.mode.toUpperCase()}`);
        if (dbState.mode === 'mongodb') {
          console.log(` Connected to MongoDB URI: ${dbState.uri}`);
        } else {
          console.log(` Running in Resilient In-Memory Storage Mode`);
          console.log(` Add your MongoDB URI in server/.env to enable persistent cloud storage.`);
        }
        console.log(`-----------------------------------------------------`);
      });
    });
}

export { httpServer, io };
