import BasePoster from './BasePoster.js';

export default class Infima extends BasePoster {
  public constructor() {
    super();
    this.timeout = 15;
    this.label = 'Infima';
    this.footer = 'full';
  };

  public draw(contentBox: HTMLElement): void {
    const infimum = 'This is a test';
    contentBox.innerHTML = `
      <article class="infima">
        <div class="container">
          <div class="vertical-line vertical-center">
            ${infimum}
          </div>
        </div>
      </article>`;
  }
}
