import BasePoster from './BasePoster.js';

export default class External extends BasePoster {
  private readonly sourceUrl: string;

  constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal', sourceUrl: string) {
    super(name, timeout, label, footer);
    this.sourceUrl = sourceUrl;
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <iframe class="tvpc-iframe" src="${this.sourceUrl}" scrolling="no" seamless=""></iframe>
    `;
  }
}
