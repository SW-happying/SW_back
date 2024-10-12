import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import connectDB from './config/dbConfig.js';


const app = express();
const PORT = 3000; 

connectDB(); 

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello Happying..!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`); 
});