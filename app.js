import express from 'express';
import cors from 'cors';
import router from '/router/index.js';

const app = express();
const PORT = 3000; 

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello Happying..!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});