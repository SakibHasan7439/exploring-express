import express, { type Application, type Request, type Response } from 'express'
import cookieParser from 'cookie-parser';

import { userRoute } from './modules/users/user.router';
import { profileRoute } from './modules/profiles/profile.route';
import { authRouter } from './modules/auth/auth.route';
import logger from './middleware/logger';
import cors from 'cors';
import globalErrorHandler from './middleware/globalErrorHandler';

const app: Application = express();

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