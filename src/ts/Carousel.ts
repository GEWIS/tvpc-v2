import BasePoster from './posters/BasePoster.js';
import Infima from './posters/Infima.js';
import {SettingsHandler as sh} from './SettingsHandler.js';
import Logo from './posters/Logo.js';
import InfoBar from './InfoBar';

export default class Carousel {
  private currentPosterNr: number;
  private currentPoster: BasePoster;
  private nextPoster: BasePoster;
  private infoBar: InfoBar;

  private static instance: Carousel;

  private constructor(infoBar: InfoBar) {
    this.infoBar = infoBar;
    this.createNextPoster(0);
    this.currentPoster = this.nextPoster;
    this.currentPosterNr = 0;
  };

  public static getInstance(infoBar: InfoBar) {
    if (Carousel.instance === undefined) {
      Carousel.instance = new Carousel(infoBar);
    }
    return Carousel.instance;
  }

  private createNextPoster(posterNr: number): void {
    const posterToSet = sh.settings.posters[posterNr];

    switch (posterToSet.type) {
      case 'infima':
        this.nextPoster = new Infima(posterToSet.timeout);
        break;
      case 'logo':
        this.nextPoster = new Logo(posterToSet.timeout);
        break;
      default:
        throw new TypeError(`Poster type ${posterToSet.type} does not exist`);
    }
  }

  public loadNextPoster() {
    this.currentPosterNr = (this.currentPosterNr + 1) % sh.settings.posters.length;
    this.createNextPoster(this.currentPosterNr);
  }

  public async drawPoster() {
    await this.infoBar.resetProgressBar();
    const contentBox = document.getElementById('tvpc-content');
    this.nextPoster.draw(contentBox);
    this.currentPoster = this.nextPoster;
    await this.infoBar.startProgressBar(this.currentPoster.timeout);
    setTimeout(this.drawPoster.bind(this), this.currentPoster.timeout * 1000);
    this.loadNextPoster();
  }
}
