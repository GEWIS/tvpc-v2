import * as express from 'express';
import {getTrains} from "./handlers/NSHandler";

export const register = ( app: express.Application ) => {
  app.get( '/api', (req: express.Request, res: express.Response) => {
    res.json('Hello world!!!');
  });

  app.get( '/api/trains', async (req: express.Request, res: express.Response) => {
    res.json(await getTrains());
  });
}
