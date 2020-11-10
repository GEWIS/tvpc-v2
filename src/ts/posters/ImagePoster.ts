import BasePoster from './BasePoster.js';

export default class ImagePoster extends BasePoster {
  protected sourceUrl: string;

  // @ts-ignore
  private image: Image;

  constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal', sourceUrl: string) {
    super(name, timeout, label, footer);
    this.sourceUrl = 'http://localhost:3000/' + sourceUrl;
  }

  protected getImage() {
    return this.image;
  }

  preLoad(): void {
    this.image = new Image();
    this.image.src = this.sourceUrl;
    console.log(this.image.src);
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <article style="background-image: url('${this.image.src}'); background-position: center; ">
    </article>
    `;
  }
}
