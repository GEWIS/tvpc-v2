import express from 'express';
import * as routes from './routes';
import dotenv from 'dotenv';
import {updateSettings} from "./handlers/SettingsHandler";

dotenv.config();

const app = express();
const port = process.env.PORT;

routes.register(app);

async function startApp() {
  console.log('Loading settings from Trello...');
  await updateSettings();

  app.use('/data', express.static('data', {
    setHeaders:
      function (res, path, stat) {
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
