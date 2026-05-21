import express, { type Application, type Request, type Response } from 'express'
import cookieParser from 'cookie-parser';
import { initDB } from './db/index.js';

import { userRoute } from './modules/users/user.router.js';
import { profileRoute } from './modules/profiles/profile.route.js';
import { authRouter } from './modules/auth/auth.route.js';
import logger from './middleware/logger.js';
import cors from 'cors';
import globalErrorHandler from './middleware/globalErrorHandler.js';

const app: Application = express();

void initDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
  origin: 'http://localhost:8000/'
}
app.use(cors(corsOptions)); 

app.use(logger);

app.get('/user', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Express server is running!",
    "author": "Sakib Hasan"
  })
})

app.use('/users', userRoute);
app.use('/api/profile', profileRoute);
app.use('/api/auth', authRouter);

app.use(globalErrorHandler);

export default app;