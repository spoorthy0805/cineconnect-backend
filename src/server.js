import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { messages, setSocket } from './store/memory.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // Basic room join for plan-based chat
  socket.on('joinPlan', (planId) => {
    if (planId) socket.join(`plan:${planId}`);
  });

  socket.on('message', ({ planId, message }) => {
    if (!planId || !message) return;
    const payload = { planId, message, timestamp: Date.now(), senderId: socket.id };
    if (!messages[planId]) messages[planId] = [];
    messages[planId].push(payload);
    io.to(`plan:${planId}`).emit('message', payload);
  });
});

// expose io for other modules if needed
setSocket(io);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
