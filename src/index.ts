import express from 'express';
import cors from 'cors'
import authRouter from './routes/authRoutes';
import { errorMiddleware } from './middleware/error.middleware';
import { AuthMiddleware } from './middleware/auth.middleware';
import userRouter from './routes/userRoutes';
import storeRouter from './routes/storeRoutes';
import { StoreMiddleware } from './middleware/store.middleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors())


app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Ok' })
})


app.use('/api', authRouter);
app.use('/api', AuthMiddleware, userRouter)
app.use('/api', AuthMiddleware, StoreMiddleware, storeRouter)


// middleware de erro deve estar sempre **por último**
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
