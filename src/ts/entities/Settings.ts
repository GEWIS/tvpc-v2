import Poster from './Poster.js';

export default class Settings {
  /** List of posters that need to be shown */
  posters: Poster[];

  /** API Token used to access the api of the GEWIS website */
  token: string;
}
