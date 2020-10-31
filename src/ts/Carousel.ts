import BasePoster from './posters/BasePoster.js';
import Infima from './posters/Infima.js';
import {SettingsHandler as sh} from './SettingsHandler.js';

export default class Carousel {
  private static instance: Carousel;

  private constructor() {};

  public static getInstance() {
    if (Carousel.instance === undefined) {
      Carousel.instance = new Carousel();
    }
    return Carousel.instance;
  }

  private currentPosterNr: number;
  private posterNames: string[];

  private currentPoster: BasePoster;
  private nextPoster: BasePoster;

  public drawPoster() {
    const contentBox = document.getElementById('tvpc-content');
    this.currentPoster = new Infima();
    this.currentPoster.draw(contentBox);

    console.log(sh.settings.posters);
    console.log(typeof sh.settings);
    console.log(typeof sh.settings.posters);
  }
}
