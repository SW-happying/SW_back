import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import connectDB from './config/dbConfig.js';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import fs from 'fs';
import ChatRoom from './models/chatRoomModel.js'; // 모델 임포트 수정

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello Happying..!');
});

const server = createServer(app);
const io = new SocketIO(server);

app.get('/chat', (req, res) => {
  fs.readFile('./static/index.html', (error, data) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// 소켓 이벤트 설정
io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`${userId}님이 ${roomId}방에 입장했습니다.`);
    
    io.to(roomId).emit('update', {
      type: 'connect',
      name: userId,
      message: `${userId}님이 입장하셨습니다.`,
    });
  });

  socket.on('message', async ({ roomId, message, userId }) => {
    console.log(`${userId}의 메시지: ${message}`);
    io.to(roomId).emit('update', { name: userId, message });

    try {
      await ChatRoom.findByIdAndUpdate(
        roomId,
        { $push: { messages: { userId, message } } },
        { new: true }
      );
    } catch (error) {
      console.error('메시지 저장 중 오류:', error);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
