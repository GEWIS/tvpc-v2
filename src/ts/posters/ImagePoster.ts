import BasePoster from './BasePoster.js';

export default class ImagePoster extends BasePoster {
  private readonly sourceUrls: string[];
  // @ts-ignore
  private image: Image;

  constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal', sourceUrls: string[]) {
    super(name, timeout, label, footer);
    this.sourceUrls = sourceUrls;
  }

  preLoad(): void {
    // Choose a random poster from the list of posters.
    // Of course, there could be only one poster in the list. Then the choice is easy
    const chosenPoster = this.sourceUrls[Math.floor(Math.random() * this.sourceUrls.length)];
    this.image = new Image();
    this.image.src = 'http://localhost:3000/' + chosenPoster;
    console.log(this.image.src);
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <article class="tvpc-photo" style="background-image: url('${this.image.src}'); background-size: cover;">
    </article>
    `;
  }
}
