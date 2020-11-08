import express, {Request, Response} from 'express';
import * as routes from './routes';
import dotenv from 'dotenv';
import {updateSettings} from "./handlers/TrelloHandler";

dotenv.config();

const app = express();
const port = process.env.PORT;

routes.register(app);

async function startApp() {
  console.log('Loading settings from Trello...');
  await updateSettings();

  app.use('/data', express.static('data'));
  app.listen(port, () => {
    console.log(`TVPC backend listening at http://localhost:${port}`);
  })

  setInterval(function() {
    updateSettings();
  }, 600000);
}

startApp();
