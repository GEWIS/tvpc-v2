import express, {Response} from 'express';
import * as routes from './routes';
import dotenv from 'dotenv';
import {updateSettings} from "./handlers/SettingsHandler";
import * as fs from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT;

routes.register(app);

if(!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

async function startApp() {
  console.log('Loading settings from Trello...');
  await updateSettings();

  app.use('/data', express.static('data', {
    setHeaders:
      function (res: Response, path: string, stat: any) {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Headers: X-Requested-With");
      }
    }
  ));
  app.listen(port, () => {
    console.log(`TVPC backend listening at http://localhost:${port}`);
  })

  setInterval(function() {
    updateSettings();
  }, 600000);
}

startApp();
