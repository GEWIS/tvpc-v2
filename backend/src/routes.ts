import * as express from 'express';
import {getTrains} from "./handlers/NSHandler";
import {_settings} from "./handlers/SettingsHandler";
import {getActivities, getInfima, getPhoto} from "./handlers/GEWISHandler";

export const register = ( app: express.Application ) => {
  app.get( '/api', (req: express.Request, res: express.Response) => {
    res.json('Hello world!!!');
  });

  app.get( '/api/settings', async (req:express.Request, res: express.Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    try {
      res.json(_settings);
    } catch (e) {
      console.error(e);
      res.status(500).json(e);
    }
  });

  app.get( '/api/activities', async (req: express.Request, res: express.Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    if (req.query.id === undefined) {
      res.status(400).json('ID undefined');
      return;
    }
    const id = parseInt(req.query.id.toString());

    try {
      res.json(await getActivities(id));
    } catch (e) {
      console.error(e);
      res.status(500).json(e);
    }
  });

  app.get( '/api/infima', async (req: express.Request, res: express.Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    if (req.query.id === undefined) {
      res.status(400).json('ID undefined');
      return;
    }
    const id = parseInt(req.query.id.toString());

    try {
      res.json(await getInfima(id));
    } catch (e) {
      console.error(e);
      res.status(500).json(e);
    }
  });

  app.get('/api/photo', async (req: express.Request, res: express.Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    if (req.query.id === undefined) {
      res.status(400).json('ID undefined');
      return;
    }
    const id = parseInt(req.query.id.toString());

    try {
      res.json(await getPhoto(id));
    } catch (e) {
      console.error(e);
      res.status(500).json(e);
    }
  });

  app.get( '/api/trains', async (req: express.Request, res: express.Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    try {
      res.json(await getTrains());
    } catch (e) {
      console.error(e);
      res.status(500).json(e);
    }
  });
}
