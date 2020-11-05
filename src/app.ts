import express, {Request, Response} from 'express';
import * as routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

routes.register(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
