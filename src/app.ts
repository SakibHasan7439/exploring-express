import express, { type Application, type Request, type Response } from 'express'
import { userRoute } from './modules/users/user.router';

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

app.get('/user', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Express server is running!",
    "author": "Sakib Hasan"
  })
})

app.use('/users', userRoute);

export default app;