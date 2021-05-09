import {doXMLHttpRequest} from '../Helper.js';
import BasePoster from './BasePoster.js';

export default class PhotoPoster extends BasePoster {
  private readonly posterNr: number;
  private sourceUrl: string;
  // @ts-ignore
  private image: Image;

  public constructor(timeout: number, posterNr: number) {
    super('Photo', timeout, undefined, 'full');
    this.posterNr = posterNr;
  }

  public async preLoad(): Promise<void> {
    const imageObj = await doXMLHttpRequest(`api/photo?id=${this.posterNr}`, 'json', true);
    this.label = imageObj.label;

    this.image = new Image();
    this.image.src = imageObj.sourceUrl;
  }

  public draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
      <article class="tvpc-photo">
        <div class="tvpc-photo-background-image" style="background-image: url('${this.image.src}')"></div>
        <div class="tvpc-photo-content" style="background-image: url('${this.image.src}')"></div>
      </article>
    `;
  }
}
