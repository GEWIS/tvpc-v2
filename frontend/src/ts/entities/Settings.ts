import Poster from './Poster';

export default class Settings {
  /** List of posters that need to be shown */
  posters: Poster[];

  defaultTimeout: number;

  defaultFooter: 'full' | 'minimal';

  screenEffect: string;
}
