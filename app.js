// app.js
import express from 'express';
import cors from 'cors';
import ottRoutes from './routes/ottRoutes.js';  // ottRoutes 경로 연결
import mongoose from 'mongoose'; 
import connectDB from './config/dbConfig.js';
import roomRoutes from './routes/roomRoutes.js';


const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(express.json());

// OTT 관련 라우트 연결
app.use('/api/ott', ottRoutes);  // '/api/ott/create'로 방 생성

// Room 관련 라우트 연결
app.use('/api/room', roomRoutes);



app.get('/', (req, res) => {
  res.send('Hello Happying..!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
