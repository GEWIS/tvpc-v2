import {doXMLHttpRequest} from '../Helper';
import BasePoster from './BasePoster';
import {Photo} from "../entities/Backend";

export default class PhotoPoster extends BasePoster {
  private readonly posterNr: number;
  private sourceUrl: string;
  private image: HTMLImageElement;

  public constructor(timeout: number, posterNr: number) {
    super('Photo', timeout, undefined, 'full');
    this.posterNr = posterNr;
  }

  public async preLoad(): Promise<void> {
    const imageObj = await doXMLHttpRequest(`api/photo?id=${this.posterNr}`, 'json', true) as Photo;
    this.label = imageObj.label;

    this.image = new Image();
    this.image.src = imageObj.sourceUrl;
  }

  public draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
      <article class="tvpc-photo">
        <div class="tvpc-photo-background-image" style="background-image: url('uhm${this.image.src}')"></div>
        <div class="tvpc-photo-content" style="background-image: url('${this.image.src}')"></div>
      </article>
    `;
  }
}
