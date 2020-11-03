import BasePoster from './BasePoster.js';

export default class ExternalPoster extends BasePoster {
  private readonly sourceUrl: string;

  constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal', sourceUrl: string) {
    super(name, timeout, label, footer);
    this.sourceUrl = sourceUrl;
  }

  preLoad(): void {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'document';
    link.href = this.sourceUrl;
    link.id = 'tvpc-iframe-' + this.name;
    link.className = 'tvpc-iframe-preloads';
    head.appendChild(link);
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <iframe class="tvpc-iframe" src="${this.sourceUrl}" scrolling="no" seamless=""></iframe>
    `;

    // Remove all remaining iframe preloads from the HTML file
    const preloads = document.getElementsByClassName('tvpc-iframe-preloads');
    for (let i = 0; i < preloads.length; i++) {
      preloads[0].outerHTML = '';
    }
  }
}
