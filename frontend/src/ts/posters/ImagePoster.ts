import BasePoster from './BasePoster';
import { baseUrl } from '../Helper';

export default class ImagePoster extends BasePoster {
  private readonly sourceUrls: string[];
  private image: HTMLImageElement;
  private shouldUseBaseUrl = false;

  constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal',
    sourceUrls: string[], baseUrl = true) {
    super(name, timeout, label, footer);
    this.sourceUrls = sourceUrls;
    this.shouldUseBaseUrl = baseUrl;
  }

  preLoad(): void {
    // Choose a random poster from the list of posters.
    // Of course, there could be only one poster in the list. Then the choice is easy
    const chosenPoster = this.sourceUrls[Math.floor(Math.random() * this.sourceUrls.length)];
    this.image = new Image();
    this.image.src = (this.shouldUseBaseUrl ? baseUrl : '') + chosenPoster;
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <article class="tvpc-photo" style="background-image: url('${this.image.src}'); background-size: cover;">
    </article>
    `;
  }
}
