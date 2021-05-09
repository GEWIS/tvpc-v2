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
import TrainsPoster from './posters/TrainsPoster.js';
import {PosterTypes} from './entities/PosterTypes.js';
import VideoPoster from './posters/VideoPoster.js';

export default class Carousel {
  private currentPosterNr: number;
  private loop: number;

  private currentPoster: BasePoster;
  private nextPoster: BasePoster;
  private readonly stukPoster: ImagePoster;

  private readonly infoBar: InfoBar;
  private readonly contentBox: HTMLElement;

  private static instance: Carousel;

  private constructor(infoBar: InfoBar, contentBox: HTMLElement) {
    this.infoBar = infoBar;
    this.contentBox = contentBox;

    this.stukPoster = new ImagePoster('It\'s broken!', sh.settings.defaultTimeout,
        '', 'full', ['src/img/AViCo het is stuk.png'], false);
    this.stukPoster.preLoad();
    this.nextPoster = new ImagePoster('AViCo TVPC V2', sh.settings.defaultTimeout,
        'AViCo TVPC V2', 'full', ['src/img/startPoster.png'], false);
    this.nextPoster.preLoad();

    this.currentPosterNr = Math.floor(Math.random() * sh.settings.posters.length);
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
    this.infoBar.hideLabel();
    await delay(600);
  }

  /**
   * Show the contents of the contentBox, aka the poster
   * @param {string} label - The label that should been shown in the infoBar
   */
  private async showPoster(label: string) {
    this.contentBox.style.opacity = '1';
    this.infoBar.showLabel(label);
    await delay(500);
  }

  /**
   * Create the next poster object and put it in this.nextPoster
   * @param {number} posterNr - Number of the poster in the list of posters that needs to be created
   */
  private createNextPoster(posterNr: number): void {
    const posterToSet = sh.settings.posters[posterNr];

    switch (posterToSet.type) {
      case PosterTypes.logo:
        this.nextPoster = new LogoPoster(posterToSet.timeout);
        sh.checkForUpdate();
        break;
      case PosterTypes.agenda:
        this.nextPoster = new AgendaPoster(posterToSet.timeout, this.currentPosterNr);
        break;
      case PosterTypes.infima:
        this.nextPoster = new InfimaPoster(posterToSet.timeout, this.currentPosterNr);
        break;
      case PosterTypes.external:
        this.nextPoster = new ExternalPoster(posterToSet.name, posterToSet.timeout, posterToSet.label,
            posterToSet.footer, posterToSet.source[0]);
        break;
      case PosterTypes.image:
        this.nextPoster = new ImagePoster(posterToSet.name, posterToSet.timeout, posterToSet.label,
            posterToSet.footer, posterToSet.source);
        break;
      case PosterTypes.photo:
        this.nextPoster = new PhotoPoster(posterToSet.timeout, this.currentPosterNr);
        break;
      case PosterTypes.train:
        this.nextPoster = new TrainsPoster(posterToSet.timeout);
        break;
      case PosterTypes.video:
        this.nextPoster = new VideoPoster(posterToSet.name, posterToSet.timeout, posterToSet.label,
            posterToSet.footer, posterToSet.source);
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
    try {
      // Let's try to draw the next poster, and if it doesn't work, we show something else on the screen
      await this.infoBar.resetProgressBar(this.nextPoster.footer);
      await this.hidePoster();
      this.nextPoster.draw(this.contentBox);
      this.currentPoster = this.nextPoster;

      this.showPoster(this.currentPoster.label);
      await this.infoBar.startProgressBar(this.currentPoster.timeout, this.currentPoster.footer);
    } catch (error) {
      console.log(error);
      // If something goes wrong drawing the current poster, we draw the "AVICO HET IS STUK" poster
      this.stukPoster.draw(this.contentBox);
      this.currentPoster = this.stukPoster;
      this.showPoster(this.currentPoster.label);
      await this.infoBar.startProgressBar(this.currentPoster.timeout, this.currentPoster.footer);
    }

    // This "should" always work, and if it doesn't, we are much, much more screwed.
    // Therefore, this piece runs outside the try-catch box
    // If preloading the poster for example fails, we need to show the stukPoster anyway, so save the problem for later
    this.loop = setTimeout(this.drawPoster.bind(this), this.currentPoster.timeout * 1000);
    await this.loadNextPoster();
    await this.nextPoster.preLoad();
  }
}
