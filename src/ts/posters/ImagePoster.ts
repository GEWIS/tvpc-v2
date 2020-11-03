import BasePoster from './BasePoster.js';

export default class ImagePoster extends BasePoster {
  private readonly sourceUrl: string;

  // @ts-ignore
  private image: Image;

  constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal', sourceUrl: string) {
    super(name, timeout, label, footer);
    this.sourceUrl = sourceUrl;
  }

  preLoad(): void {
    this.image = new Image();
    this.image.src = this.sourceUrl;
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <article class="photo" style="background-image: url('${this.image.src}')">
    </article>
    `;
  }
}
