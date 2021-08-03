import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import { updateSettings } from "./handlers/SettingsHandler";
import * as fs from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT;

routes(app);

if(!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

async function startApp() {
  console.log('Loading settings from Trello...');
  await updateSettings();

  // Maps /data to the data folder.
  app.use('/data', express.static('data', { setHeaders: (res: express.Response) => {
    res.setHeader('Cache-Control', 'public, max-age=600000');
  } }));

  app.listen(port, () => {
    console.log(`TVPC backend listening at http://localhost:${port}`);
  });

  setInterval(function() {
    updateSettings();
  }, 600000);
}

startApp();
