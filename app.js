import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000; 

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Happying..!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});