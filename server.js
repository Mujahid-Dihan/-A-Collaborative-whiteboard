import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes'; // Fixed import
import meetingRoutes from './routes/meetingRoutes'; // Fixed import

config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(json());

connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/meeting', meetingRoutes);

// 🧠 Memory map for drawing/screen-sharing permissions (can move to DB later)
const drawPermissions = new Map();
const screenSharePermissions = new Map();

// 🧠 Real-time communication
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-room', ({ meetingId, userId }) => {
    socket.join(meetingId);
    io.to(meetingId).emit('user-joined', { userId, socketId: socket.id });
  });

  // 🖌 Drawing (host or approved users only)
  socket.on('draw', ({ meetingId, userId, data }) => {
    const approved = drawPermissions.get(userId);
    if (approved) {
      socket.to(meetingId).emit('draw', data);
    }
  });

  // 🧼 Clear board
  socket.on('clear-board', ({ meetingId }) => {
    io.to(meetingId).emit('clear-board');
  });

  // 💬 Chat
  socket.on('message', ({ meetingId, message, user }) => {
    io.to(meetingId).emit('message', { message, user });
  });

  // 📺 Screen share request
  socket.on('request-screen-share', ({ meetingId, userId }) => {
    io.to(meetingId).emit('screen-share-request', userId);
  });

  // ✅ Host approval
  socket.on('approve-screen-share', ({ userId }) => {
    screenSharePermissions.set(userId, true);
  });

  socket.on('approve-draw', ({ userId }) => {
    drawPermissions.set(userId, true);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
