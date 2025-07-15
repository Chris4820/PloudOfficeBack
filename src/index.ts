import express from 'express';
import cors from 'cors'
import authRouter from './routes/authRoutes';
import { errorMiddleware } from './middleware/error.middleware';
import { AuthMiddleware } from './middleware/auth.middleware';
import userRouter from './routes/userRoutes';
import storeRouter from './routes/storeRoutes';
import { StoreMiddleware } from './middleware/store.middleware';
import externalRouter from './routes/store-external.router';
import nunjucks from 'nunjucks';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors())


app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Ok' })
})

function ConfigureNjkLocalDevelopment() {
  app.set('views', path.join(__dirname, '/views'));

  nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true,
  })
  app.set('view engine', 'njk')
}
ConfigureNjkLocalDevelopment();



app.use('/api', authRouter);
app.use('/api', externalRouter);
app.use('/api', AuthMiddleware, userRouter)
app.use('/api', AuthMiddleware, StoreMiddleware, storeRouter)


// middleware de erro deve estar sempre **por último**
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
