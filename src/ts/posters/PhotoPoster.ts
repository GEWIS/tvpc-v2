import ImagePoster from './ImagePoster.js';
import {doXMLHttpRequest} from '../Helper.js';

export default class PhotoPoster extends ImagePoster {
  private readonly posterNr: number;

  public constructor(timeout: number, posterNr: number) {
    super('Photo', timeout, undefined, 'full', undefined);
    this.posterNr = posterNr;
  }

  private async requestImageObj(posterNr: number): Promise<string> {
    return await doXMLHttpRequest(`http://localhost:3000/api/photo?id=${posterNr}`);
  }

  public async preLoad(): Promise<void> {
    const json = (await this.requestImageObj(this.posterNr));
    const imageObj = JSON.parse(json);
    this.label = imageObj.label;
    this.sourceUrl = imageObj.sourceUrl;

    super.preLoad();
  }

  public draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
      <article class="tvpc-photo">
        <div class="tvpc-photo-background-image" style="background-image: url('${super.getImage().src}')"></div>
        <div class="tvpc-photo-content" style="background-image: url('${super.getImage().src}')"></div>
      </article>
    `;
  }

  /* public async preLoad(): Promise<void> {
    const albumId = this.galleries[Math.floor(Math.random() * this.galleries.length)];
    const json = await this.requestImage(albumId);
    const result = JSON.parse(json);

    this.label = result.album.name;
    const nrOfPhotos = result.photos.length;
    const photo = result.photos[Math.floor(Math.random() * nrOfPhotos)];
    this.sourceUrl = '/data/' + photo.path;

    super.preLoad();
  } */

  /*
   * Function draw() is inherited from ImagePoster
   */
}
