import BasePoster from './posters/BasePoster.js';
import InfimaPoster from './posters/InfimaPoster.js';
import ExternalPoster from './posters/ExternalPoster.js';
import ImagePoster from './posters/ImagePoster.js';
import {SettingsHandler as sh} from './SettingsHandler.js';
import LogoPoster from './posters/LogoPoster.js';
import InfoBar from './InfoBar.js';
import {delay} from './Helper.js';
import PhotoPoster from './posters/PhotoPoster.js';
import AgendaPoster from './posters/AgendaPoster.js';

export default class Carousel {
  private currentPosterNr: number;
  private currentPoster: BasePoster;
  private nextPoster: BasePoster;
  private loop: number;
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
   * Forcefully go to the next poster
   */
  public async forceNextPoster() {
    clearTimeout(this.loop);
    await this.drawPoster();
  }

  /**
   * Forcefully pause the loop. Can only be restarted by forcing the next poster
   */
  public stopLoop() {
    clearTimeout(this.loop);
    this.infoBar.resetProgressBar(this.currentPoster.footer);
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
      case 'agenda':
        this.nextPoster = new AgendaPoster(posterToSet.timeout);
        break;
      case 'infima':
        this.nextPoster = new InfimaPoster(posterToSet.timeout);
        break;
      case 'logo':
        this.nextPoster = new LogoPoster(posterToSet.timeout);
        break;
      // Includes legacy format without footer
      case 'external':
        this.nextPoster = new ExternalPoster(posterToSet.name, posterToSet.timeout, posterToSet.label,
            posterToSet.footer || 'full', posterToSet.source);
        break;
      // Legacy format: only here for backwards compatibility
      case 'poster':
        this.nextPoster = new ImagePoster(posterToSet.name, posterToSet.timeout, posterToSet.label,
            posterToSet.footer || 'full', posterToSet.posters[0]);
        break;
      case 'image':
        this.nextPoster = new ImagePoster(posterToSet.name, posterToSet.timeout, posterToSet.label,
            posterToSet.footer, posterToSet.source);
        break;
      case 'photo':
        this.nextPoster = new PhotoPoster(posterToSet.timeout, posterToSet.galleries);
        break;
      default:
        throw new TypeError(`Poster type ${posterToSet.type} does not exist`);
    }
  }

  /**
   * Load the next poster in the appropriate variables
   */
  private loadNextPoster() {
    this.currentPosterNr = (this.currentPosterNr + 1) % sh.settings.posters.length;
    this.createNextPoster(this.currentPosterNr);
  }

  /**
   * Draw the next poster and load pre-load the next next poster
   */
  public async drawPoster() {
    await this.infoBar.resetProgressBar(this.nextPoster.footer);
    await this.hidePoster();
    this.nextPoster.draw(this.contentBox);
    this.currentPoster = this.nextPoster;

    this.showPoster();
    await this.infoBar.startProgressBar(this.currentPoster.timeout, this.currentPoster.footer);
    this.loop = setTimeout(this.drawPoster.bind(this), this.currentPoster.timeout * 1000);
    await this.loadNextPoster();
    await this.nextPoster.preLoad();
  }
}
