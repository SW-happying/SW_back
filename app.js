import express from 'express';
import cors from 'cors';
import http from 'http'; // http 모듈 추가
import { Server } from 'socket.io'; // socket.io 모듈 추가
import router from './routes/index.js';
import connectDB from './config/dbConfig.js';

const app = express();
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server);

connectDB();

io.on('connection', (socket) => {
  console.log('새로운 사용자가 연결되었습니다.');
  
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`사용자가 방 ${roomId}에 입장했습니다.`);
  });

  socket.on('leaveRoom', ({ roomId, userId }) => {
    socket.leave(roomId);
    console.log(`${userId}가 방 ${roomId}을 떠났습니다.`);
  });
  
  socket.on('sendMessage', (message) => {
    io.to(message.roomId).emit('receiveMessage', message);
    console.log(`메시지가 방 ${message.roomId}에 전송되었습니다.`);
  });
  
  socket.on('disconnect', () => {
    console.log('사용자가 연결을 해제했습니다.');
  });
});

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello Happying..!');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
