import BasePoster from './posters/BasePoster.js';
import Infima from './posters/Infima.js';
import {SettingsHandler as sh} from './SettingsHandler.js';
import Logo from './posters/Logo.js';
import InfoBar from './InfoBar.js';
import {delay} from './Helper.js';

export default class Carousel {
  private currentPosterNr: number;
  private currentPoster: BasePoster;
  private nextPoster: BasePoster;
  private readonly infoBar: InfoBar;
  private readonly contentBox: HTMLElement;

  private static instance: Carousel;

  private constructor(infoBar: InfoBar, contentBox: HTMLElement) {
    this.infoBar = infoBar;
    this.createNextPoster(0);
    this.currentPoster = this.nextPoster;
    this.currentPosterNr = 0;
    this.contentBox = contentBox;
  };

  public static getInstance(infoBar: InfoBar, contentBox: HTMLElement) {
    if (Carousel.instance === undefined) {
      Carousel.instance = new Carousel(infoBar, contentBox);
    }
    return Carousel.instance;
  }

  /**
   * Hide the contents of the contentBox, aka the poster
   */
  private async hidePoster() {
    this.contentBox.style.opacity = '0';
    await delay(500);
  }

  /**
   * Show the contents of the contentBox, aka the poster
   */
  private async showPoster() {
    this.contentBox.style.opacity = '1';
    await delay(250);
  }

  /**
   * Create the next poster object and put it in this.nextPoster
   * @param {number} posterNr - Number of the poster in the list of posters that needs to be created
   */
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

  /**
   * Load the next poster in the appropriate variables
   */
  public loadNextPoster() {
    this.currentPosterNr = (this.currentPosterNr + 1) % sh.settings.posters.length;
    this.createNextPoster(this.currentPosterNr);
  }

  /**
   * Draw the next poster and load pre-load the next next poster
   */
  public async drawPoster() {
    await this.infoBar.resetProgressBar();
    await this.hidePoster();
    this.nextPoster.draw(this.contentBox);
    this.currentPoster = this.nextPoster;

    await this.showPoster();
    await this.infoBar.startProgressBar(this.currentPoster.timeout);
    setTimeout(this.drawPoster.bind(this), this.currentPoster.timeout * 1000);
    this.loadNextPoster();
  }
}
