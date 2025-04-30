import { io } from 'socket.io-client';

const URL = 'http://localhost:5000'; // adjust if different

export const socket = io(URL, {
  autoConnect: false,
});
