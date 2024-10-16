import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import connectDB from './config/dbConfig.js';
import { createServer } from 'http';  
import { Server as SocketIO } from 'socket.io';  
import fs from 'fs';  

const app = express();
const PORT = 5000;

// 데이터베이스 연결
connectDB();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

// API 라우트 연결
app.use('/api', router);

// 채팅방 페이지 제공 (동적 라우트 적용)
app.get('/chat/:roomId/:userId', (req, res) => {
  const { roomId, userId } = req.params;
  fs.readFile('./static/index.html', 'utf8', (error, data) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }
    // HTML 파일에 roomId를 포함하여 전달
    const modifiedData = data.replace('##ROOM_ID##', roomId);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(modifiedData);
  });
});

// 소켓 설정
const server = createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*", // 클라이언트에서의 CORS 문제 해결
  },
});

io.on('connection', (socket) => {
  let roomId;

  // 새로운 유저가 입장할 때
  socket.on('joinRoom', ({ userId, roomId: room }) => {
    roomId = room;
    socket.join(roomId);
    socket.userId = userId;
    console.log(`${userId}님이 ${roomId} 방에 입장했습니다.`);

    io.to(roomId).emit('update', { type: 'connect', userId: 'server', message: `${userId}님이 입장했습니다.` });
  });

  // 유저가 메시지를 전송할 때
  socket.on('message', (data) => {
    data.userId = socket.userId;
    io.to(roomId).emit('update', data);
    console.log(`${data.name}의 메시지: ${data.message}`);
  });

  // 유저가 나갈 때
  socket.on('disconnect', () => {
    if (socket.userId) {
      io.to(roomId).emit('update', { type: 'disconnect', userId: 'SERVER', message: `${socket.name}님이 나갔습니다.` });
    }
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
