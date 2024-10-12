import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import connectDB from './config/dbConfig.js';


const app = express();
const PORT = 5000; 

connectDB(); 

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello Happying..!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});